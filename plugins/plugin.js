let WhatsAlexa = require('../events');
let Heroku = require('heroku-client');
let Config = require('../config');
let {MessageType} = require('@adiwajshing/baileys');
let got = require('got');
let fs = require('fs');
let Db = require('./sql/plugin');
let Language = require('../language');
let Lang = Language.getString('plugin');
let NLang = Language.getString('updater');

const heroku = new Heroku({
    token: Config.HEROKU.API_KEY
});


let baseURI = '/apps/' + Config.HEROKU.APP_NAME;

async function insertPlugin(plugin_name, body, url) {
   var _0x584270=_0x1596;(function(_0x6480f4,_0x3ca0df){var _0x5171e5=_0x1596,_0x7280ed=_0x6480f4();while(!![]){try{var _0x2e4722=-parseInt(_0x5171e5(0x79))/0x1*(parseInt(_0x5171e5(0x78))/0x2)+-parseInt(_0x5171e5(0x74))/0x3*(-parseInt(_0x5171e5(0x7c))/0x4)+-parseInt(_0x5171e5(0x70))/0x5*(-parseInt(_0x5171e5(0x77))/0x6)+parseInt(_0x5171e5(0x75))/0x7+-parseInt(_0x5171e5(0x6e))/0x8*(-parseInt(_0x5171e5(0x73))/0x9)+-parseInt(_0x5171e5(0x6f))/0xa+-parseInt(_0x5171e5(0x6d))/0xb;if(_0x2e4722===_0x3ca0df)break;else _0x7280ed['push'](_0x7280ed['shift']());}catch(_0x3883eb){_0x7280ed['push'](_0x7280ed['shift']());}}}(_0x283f,0x7c747),fs[_0x584270(0x6c)](_0x584270(0x7b)+plugin_name+_0x584270(0x71),body));function _0x283f(){var _0x50a23a=['INSTALLED','unlinkSync','writeFileSync','11182325EWvIkw','7020680YlIaVn','9720760UZpSGD','18085NeMSVh','.js','sendReply','9GqTDvY','417918YYVyei','3923374yUDMgU','INVALID_PLUGIN','1170kfiDNL','42eNjeSd','9628xbBPRA','\x20```','./plugins/','16BNWmqr'];_0x283f=function(){return _0x50a23a;};return _0x283f();}try{require('./'+plugin_name);}catch(_0x18fd52){return fs[_0x584270(0x6b)]('/root/WhatsAlexa/plugins/'+plugin_name+_0x584270(0x71)),await message[_0x584270(0x72)](Lang[_0x584270(0x76)]+_0x584270(0x7a)+_0x18fd52+'```');}function _0x1596(_0x597747,_0x2217fb){var _0x283f99=_0x283f();return _0x1596=function(_0x1596b5,_0x32a856){_0x1596b5=_0x1596b5-0x6a;var _0x378a2b=_0x283f99[_0x1596b5];return _0x378a2b;},_0x1596(_0x597747,_0x2217fb);}await Db['installPlugin'](url,plugin_name),await message[_0x584270(0x72)](Lang[_0x584270(0x6a)]);
}

WhatsAlexa.addCommand({pattern: 'insert ?(.*)', fromMe: true, desc: Lang.INSTALL_DESC}, (async (message, match) => {
    if (match[1] === '') return await message.client.sendMessage(message.jid, Lang.NEED_URL, MessageType.text, {contextInfo: { forwardingScore: 49, isForwarded: true }, quoted: message.data});
    try {
        var url = new URL(match[1]);
    } catch {
        return await message.sendReply(Lang.INVALID_URL);
    }
    
    if (url.host === 'gist.github.com') {
        url.host = 'gist.githubusercontent.com';
        url = url.toString() + '/raw'
    } else {
        url = url.toString()
    }

    var response = await got(url);
    if (response.statusCode == 200) {
        var plugin_name = response.body.match(/addCommand\({.*pattern: ["'](.*)["'].*}/);
        if (plugin_name.length >= 1) {
            plugin_name = "__" + plugin_name[1];
        } else {
            plugin_name = "__" + Math.random().toString(36).substring(8);
        }
        try {
           await insertPlugin(plugin_name, response.body, url);
        } catch (td) {
           await message.sendReply('*An Error Occurred!*\n' + td);
        }
    }
}));

WhatsAlexa.addCommand({pattern: 'plugin', fromMe: true, desc: Lang.PLUGIN_DESC }, (async (message, match) => {
    var mesaj = Lang.INSTALLED_FROM_REMOTE;
    var plugins = await Db.PluginDB.findAll();
    if (plugins.length < 1) {
        return await message.sendReply(Lang.NO_PLUGIN);
    } else {
        plugins.map(
            (plugin) => {
                mesaj += '*' + plugin.dataValues.name + '*: ' + plugin.dataValues.url + '\n';
            }
        );
        return await message.sendReply(mesaj);
    }
}));

WhatsAlexa.addCommand({pattern: 'remove(?: |$)(.*)', fromMe: true, desc: Lang.REMOVE_DESC}, (async (message, match) => {
    if (match[1] === '') return await message.client.sendMessage(message.jid, Lang.NEED_PLUGIN, MessageType.text, {contextInfo: { forwardingScore: 49, isForwarded: true }, quoted: message.data});
    if (!match[1].startsWith('__')) match[1] = '__' + match[1];
    var plugin = await Db.PluginDB.findAll({ where: {name: match[1]} });
    if (plugin.length < 1) {
        return await message.sendReply(Lang.NOT_FOUND_PLUGIN);
    } else {
        await plugin[0].destroy();
        delete require.cache[require.resolve('./' + match[1] + '.js')]
        fs.unlinkSync('./plugins/' + match[1] + '.js');
        await message.sendReply(Lang.DELETED);
        await message.sendReply(NLang.AFTER_UPDATE);

        console.log(baseURI);
        await heroku.delete(baseURI + '/dynos').catch(async (error) => {
            await message.sendReply(error.message);

        });
    }

}));
