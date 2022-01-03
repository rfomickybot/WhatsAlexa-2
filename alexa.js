const fs = require("fs");
const path = require("path");
const events = require("./events");
const chalk = require('chalk');
const config = require('./config');
const pkg = require('./package.json');
const axios = require('axios');
const Modules = require('whatsalexa-modules');
const Heroku = require('heroku-client');
const {WAConnection, MessageOptions, MessageType, Mimetype, Presence, ChatModification} = require('@adiwajshing/baileys');
const {Message, StringSession, Image, Video} = require('./alexa/');
const { DataTypes } = require('sequelize');
const { GreetingsDB, getMessage } = require("./plugins/sql/greetings");
const got = require('got');

const heroku = new Heroku({
    token: config.HEROKU.API_KEY
});

let baseURI = '/apps/' + config.HEROKU.APP_NAME;


const WhatsAlexaDB = config.DATABASE.define('WhatsAlexa', {
    info: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

function loadPlugins() {
   function _0x3e5a(_0x438df2,_0x3645ae){var _0x9e5df3=_0x9e5d();return _0x3e5a=function(_0x3e5a5c,_0x505fce){_0x3e5a5c=_0x3e5a5c-0x1ba;var _0x2f0f59=_0x9e5df3[_0x3e5a5c];return _0x2f0f59;},_0x3e5a(_0x438df2,_0x3645ae);}function _0x9e5d(){var _0x137505=['1634502VViRVb','9405gSQKlj','toLowerCase','readdirSync','2jYJJND','1809500ZhvZuq','extname','7218783jEpkUz','./plugins/sql/','7OJzRHB','10WPNOIN','1692255xQnoDp','998154FAgopZ','1255008mbMVXg','.js','forEach'];_0x9e5d=function(){return _0x137505;};return _0x9e5d();}var _0x12d80e=_0x3e5a;(function(_0x4129f9,_0xe27166){var _0x240fa2=_0x3e5a,_0x459a20=_0x4129f9();while(!![]){try{var _0x1b3ce7=-parseInt(_0x240fa2(0x1c1))/0x1*(-parseInt(_0x240fa2(0x1c4))/0x2)+-parseInt(_0x240fa2(0x1bc))/0x3+-parseInt(_0x240fa2(0x1c5))/0x4+parseInt(_0x240fa2(0x1bb))/0x5+parseInt(_0x240fa2(0x1c0))/0x6*(-parseInt(_0x240fa2(0x1c9))/0x7)+parseInt(_0x240fa2(0x1bd))/0x8+parseInt(_0x240fa2(0x1c7))/0x9*(parseInt(_0x240fa2(0x1ba))/0xa);if(_0x1b3ce7===_0xe27166)break;else _0x459a20['push'](_0x459a20['shift']());}catch(_0x1461b7){_0x459a20['push'](_0x459a20['shift']());}}}(_0x9e5d,0x3cddd),fs[_0x12d80e(0x1c3)]('./plugins/sql/')[_0x12d80e(0x1bf)](_0x1a8a38=>{var _0x31641b=_0x12d80e;path[_0x31641b(0x1c6)](_0x1a8a38)[_0x31641b(0x1c2)]()==_0x31641b(0x1be)&&require(_0x31641b(0x1c8)+_0x1a8a38);}));
}

async function loadExternalPlugins() {
   var _0xba8743=_0x274b;function _0x274b(_0x45abea,_0x1e3bcb){var _0x3de8bd=_0x3de8();return _0x274b=function(_0x274b05,_0x477205){_0x274b05=_0x274b05-0x80;var _0x4af4ae=_0x3de8bd[_0x274b05];return _0x4af4ae;},_0x274b(_0x45abea,_0x1e3bcb);}(function(_0x41da64,_0x554fb9){var _0x4e78e2=_0x274b,_0x3a29f3=_0x41da64();while(!![]){try{var _0x189e8b=-parseInt(_0x4e78e2(0x86))/0x1*(-parseInt(_0x4e78e2(0x94))/0x2)+-parseInt(_0x4e78e2(0x96))/0x3+-parseInt(_0x4e78e2(0x9b))/0x4*(-parseInt(_0x4e78e2(0x85))/0x5)+parseInt(_0x4e78e2(0x8f))/0x6*(parseInt(_0x4e78e2(0x8e))/0x7)+-parseInt(_0x4e78e2(0x91))/0x8*(parseInt(_0x4e78e2(0x8c))/0x9)+parseInt(_0x4e78e2(0x88))/0xa*(-parseInt(_0x4e78e2(0x87))/0xb)+-parseInt(_0x4e78e2(0x8d))/0xc*(parseInt(_0x4e78e2(0x95))/0xd);if(_0x189e8b===_0x554fb9)break;else _0x3a29f3['push'](_0x3a29f3['shift']());}catch(_0xef1122){_0x3a29f3['push'](_0x3a29f3['shift']());}}}(_0x3de8,0x2b33f),console[_0xba8743(0x8b)](chalk['blueBright'][_0xba8743(0x99)](_0xba8743(0x97))));var plugins=await plugindb[_0xba8743(0x98)][_0xba8743(0x92)]();plugins['map'](async _0x47a45e=>{var _0x1684c9=_0xba8743;try{if(!fs[_0x1684c9(0x84)]('./plugins/'+_0x47a45e[_0x1684c9(0x9a)]['name']+'.js')){console[_0x1684c9(0x8b)](_0x47a45e['dataValues']['name']);var _0x2adbb1=await got(_0x47a45e[_0x1684c9(0x9a)]['url']);_0x2adbb1[_0x1684c9(0x8a)]==0xc8&&(fs[_0x1684c9(0x90)](_0x1684c9(0x81)+_0x47a45e[_0x1684c9(0x9a)]['name']+_0x1684c9(0x82),_0x2adbb1[_0x1684c9(0x83)]),require(_0x1684c9(0x81)+_0x47a45e[_0x1684c9(0x9a)][_0x1684c9(0x89)]+_0x1684c9(0x82)));}}catch{console[_0x1684c9(0x8b)](_0x1684c9(0x93)+_0x47a45e[_0x1684c9(0x9a)][_0x1684c9(0x89)]+_0x1684c9(0x80));}}),console[_0xba8743(0x8b)](chalk['blueBright'][_0xba8743(0x99)]('✅\x20COMMANDS\x20INSTALLED\x20SUCCESSFULLY!'));function _0x3de8(){var _0x44194e=['559917nyLWWn','18672YwZoyK','14wniarD','904416WedDZu','writeFileSync','32OtQCzv','findAll','❌\x20PLUGIN\x20(','914qmHDMk','546cQaGgY','100197kvNOzi','⬇️\x20INSTALLING\x20COMMANDS...','PluginDB','italic','dataValues','495916QYbHXj',')\x20HAS\x20BEEN\x20CORRUPTED!','./plugins/','.js','body','existsSync','5SazNuQ','693hyvnLI','33QROzrV','725300uCMLfN','name','statusCode','log'];_0x3de8=function(){return _0x44194e;};return _0x3de8();}
}

var OWN = { ff: '0' }
const plugindb = require('./plugins/sql/plugin');

String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

var _0x245488=_0x5d7c;function _0x5d7c(_0x11a60c,_0x4c42af){var _0x55da64=_0x55da();return _0x5d7c=function(_0x5d7c7e,_0x5c4a3a){_0x5d7c7e=_0x5d7c7e-0x1b9;var _0x42bcd4=_0x55da64[_0x5d7c7e];return _0x42bcd4;},_0x5d7c(_0x11a60c,_0x4c42af);}function _0x55da(){var _0x34f261=['5279bcTwYb','1334275RXNagz','64nXWQdK','long','toLocaleDateString','```⏱\x20Time\x20:','21954raArCp','numeric','307488WDRFgg','4kKEGfW','223029TgLXJs','74282EBKtxG','toLocaleString','389040IAwYyF','84lElhti'];_0x55da=function(){return _0x34f261;};return _0x55da();}(function(_0x41abc5,_0x532a47){var _0x386543=_0x5d7c,_0x489fea=_0x41abc5();while(!![]){try{var _0x23b577=parseInt(_0x386543(0x1c0))/0x1+-parseInt(_0x386543(0x1bc))/0x2+parseInt(_0x386543(0x1b9))/0x3*(parseInt(_0x386543(0x1ba))/0x4)+parseInt(_0x386543(0x1c1))/0x5+-parseInt(_0x386543(0x1c6))/0x6*(-parseInt(_0x386543(0x1bf))/0x7)+-parseInt(_0x386543(0x1c2))/0x8*(parseInt(_0x386543(0x1bb))/0x9)+-parseInt(_0x386543(0x1be))/0xa;if(_0x23b577===_0x532a47)break;else _0x489fea['push'](_0x489fea['shift']());}catch(_0x39b29f){_0x489fea['push'](_0x489fea['shift']());}}}(_0x55da,0x23375));var getTime=new Date()[_0x245488(0x1bd)]('HI',{'timeZone':'Asia/Kolkata'})['split']('\x20')[0x1],whichType={'weekday':_0x245488(0x1c3),'year':'numeric','month':_0x245488(0x1c3),'day':_0x245488(0x1c7)},getDate=new Date()[_0x245488(0x1c4)](whichType);async function activeFrom(){var _0x7e6d41=_0x245488;return _0x7e6d41(0x1c5)+getTime+'```\x0a```📅\x20Date\x20:'+getDate+'```';} // Active From

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

async function Alexa () {
    let version = await Modules.webwa_version();
    await config.DATABASE.sync();
    var StrSes_Db = await WhatsAlexaDB.findAll({
        where: {
          info: 'StringSession'
        }
    });
   
    const WhatsAlexa = new WAConnection();
    const Session = new StringSession();
    WhatsAlexa.version = version;
    WhatsAlexa.setMaxListeners(0);

    WhatsAlexa.logger.level = config.DEBUG ? 'debug' : 'warn';
    var nodb;

    if (StrSes_Db.length < 1) {
        nodb = true;
        WhatsAlexa.loadAuthInfo(Session.deCrypt(config.SESSION)); 
    } else {
        WhatsAlexa.loadAuthInfo(Session.deCrypt(StrSes_Db[0].dataValues.value));
    }

    WhatsAlexa.on ('open', async () => {
        console.log(
            chalk.blueBright.italic('✅️ SUCCESSFULLY LOADED SESSION!')
        );

        const authInfo = WhatsAlexa.base64EncodedAuthInfo();
        if (StrSes_Db.length < 1) {
            await WhatsAlexaDB.create({ info: "StringSession", value: Session.createStringSession(authInfo) });
        } else {
            await StrSes_Db[0].update({ value: Session.createStringSession(authInfo) });
        }
    })   

        console.log(
            chalk.blueBright.italic('🔁 LOADING YOUR SESSION...')
        );

    WhatsAlexa.on('connecting', async () => {
        console.log(`⭕️ WAITING FOR CONNECTION...`);
    });
    
    WhatsAlexa.on('open', async () => {
        console.log(
            chalk.blueBright.italic('🔁 CHECKING FOR EXTERNAL COMMANDS...')
        );

        await loadExternalPlugins();

        fs.readdirSync('./plugins').forEach(plugin => {
            if(path.extname(plugin).toLowerCase() == '.js') {
                require('./plugins/' + plugin);
            }
        });

        function _0xccb3(){var _0x1597e6=['green','76540CjMqFx','797496yHdlhe','22GDsybE','ATS','bold','352816MiUEzx','45754ghyTZE','A\x20IS\x20NOW\x20ACTIVE\x20IN\x20YOUR\x20ACCOUNT!','889923jVdypB','3576769PsQJbr','128kiBpGY','8236053MwaQGY'];_0xccb3=function(){return _0x1597e6;};return _0xccb3();}var _0x404828=_0x3fe5;function _0x3fe5(_0x3837a9,_0x37675f){var _0xccb320=_0xccb3();return _0x3fe5=function(_0x3fe574,_0x4b349c){_0x3fe574=_0x3fe574-0x1c2;var _0x39b1f1=_0xccb320[_0x3fe574];return _0x39b1f1;},_0x3fe5(_0x3837a9,_0x37675f);}(function(_0xbd7e6a,_0xed2299){var _0x38c222=_0x3fe5,_0x384abe=_0xbd7e6a();while(!![]){try{var _0x4e926a=parseInt(_0x38c222(0x1cd))/0x1*(parseInt(_0x38c222(0x1c4))/0x2)+parseInt(_0x38c222(0x1c6))/0x3+-parseInt(_0x38c222(0x1c8))/0x4*(parseInt(_0x38c222(0x1cb))/0x5)+-parseInt(_0x38c222(0x1cc))/0x6+-parseInt(_0x38c222(0x1c7))/0x7+-parseInt(_0x38c222(0x1c3))/0x8+parseInt(_0x38c222(0x1c9))/0x9;if(_0x4e926a===_0xed2299)break;else _0x384abe['push'](_0x384abe['shift']());}catch(_0x22fc0b){_0x384abe['push'](_0x384abe['shift']());}}}(_0xccb3,0x8327b),console['log'](chalk[_0x404828(0x1ca)][_0x404828(0x1c2)]('🎉\x20W'+'H'+_0x404828(0x1ce)+'AL'+'EX'+_0x404828(0x1c5))));

         if (config.LANG == 'EN') {
             let enmsg = await Modules.start_message('EN', WhatsAlexa.user.jid);
             await WhatsAlexa.sendMessage(WhatsAlexa.user.jid, fs.readFileSync("./src/image/WhatsAlexa.png"), MessageType.image, { mimetype: Mimetype.png, caption: enmsg});
             
         } else if (config.LANG == 'ID') {
             let idmsg = await Modules.start_message('ID', WhatsAlexa.user.jid);
             await WhatsAlexa.sendMessage(WhatsAlexa.user.jid, fs.readFileSync("./src/image/WhatsAlexa.png"), MessageType.image, { mimetype: Mimetype.png, caption: idmsg});
             
         } else {
             let mlmsg = await Modules.start_message('ML', WhatsAlexa.user.jid);
             await WhatsAlexa.sendMessage(WhatsAlexa.user.jid, fs.readFileSync("./src/image/WhatsAlexa.png"), MessageType.image, { mimetype: Mimetype.png, caption: mlmsg});
        }
    });
    
    setInterval(async () => { 
        if (config.AUTOBIO == 'true') {
            var _0x328c9a=_0x1ce5;(function(_0xfcfced,_0x2f96e5){var _0x35dc28=_0x1ce5,_0x26be2c=_0xfcfced();while(!![]){try{var _0x332eb4=-parseInt(_0x35dc28(0x12f))/0x1*(parseInt(_0x35dc28(0x122))/0x2)+parseInt(_0x35dc28(0x11f))/0x3+-parseInt(_0x35dc28(0x129))/0x4+-parseInt(_0x35dc28(0x131))/0x5*(parseInt(_0x35dc28(0x134))/0x6)+parseInt(_0x35dc28(0x13c))/0x7+parseInt(_0x35dc28(0x11e))/0x8+parseInt(_0x35dc28(0x126))/0x9;if(_0x332eb4===_0x2f96e5)break;else _0x26be2c['push'](_0x26be2c['shift']());}catch(_0x354df4){_0x26be2c['push'](_0x26be2c['shift']());}}}(_0x2fed,0x51e49));function _0x1ce5(_0x4014b1,_0x555b83){var _0x2fed81=_0x2fed();return _0x1ce5=function(_0x1ce5e5,_0x489b45){_0x1ce5e5=_0x1ce5e5-0x119;var _0x4447e9=_0x2fed81[_0x1ce5e5];return _0x4447e9;},_0x1ce5(_0x4014b1,_0x555b83);}function _0x2fed(){var _0x4d2d2d=['Asia/Ashgabat','numeric','user','Europe/Madrid','startsWith','Asia/Colombo','📅\x20','572432eQmXIk','setStatus','\x0a\x0a⏱\x20Auto\x20Bio\x20By\x20WhatsAlexa','America/New_York','Asia/Jakarta','long','994','Europe/Istanbul','225640axVYwV','706299fCtWda','993','toLocaleDateString','4336EKGWqU','Australia/Lord_Howe','998','\x0a⌚\x20','4802931SfWWrC','LANG','jid','1632340LIBsjA','split','Asia/Kolkata','America/Noronha','Europe/Rome','toLocaleString','8aQoTOY','Europe/Lisbon','591055iMbMJP','Europe/London','Asia/Baku','6gcureP'];_0x2fed=function(){return _0x4d2d2d;};return _0x2fed();}if(WhatsAlexa[_0x328c9a(0x137)][_0x328c9a(0x128)]['startsWith']('90')){var ov_time=new Date()[_0x328c9a(0x12e)]('LK',{'timeZone':_0x328c9a(0x11d)})[_0x328c9a(0x12a)]('\x20')[0x1];const get_localized_date={'weekday':_0x328c9a(0x11b),'year':_0x328c9a(0x136),'month':_0x328c9a(0x11b),'day':_0x328c9a(0x136)};var utch=new Date()[_0x328c9a(0x121)](config[_0x328c9a(0x127)],get_localized_date);const biography=_0x328c9a(0x13b)+utch+_0x328c9a(0x125)+ov_time+'\x0a\x0a⏱\x20Auto\x20Bio\x20By\x20WhatsAlexa';await WhatsAlexa['setStatus'](biography);}else{if(WhatsAlexa['user'][_0x328c9a(0x128)][_0x328c9a(0x139)](_0x328c9a(0x11c))){var ov_time=new Date()[_0x328c9a(0x12e)]('AZ',{'timeZone':_0x328c9a(0x133)})['split']('\x20')[0x1];const get_localized_date={'weekday':_0x328c9a(0x11b),'year':'numeric','month':'long','day':_0x328c9a(0x136)};var utch=new Date()['toLocaleDateString'](config[_0x328c9a(0x127)],get_localized_date);const biography=_0x328c9a(0x13b)+utch+_0x328c9a(0x125)+ov_time+_0x328c9a(0x13e);await WhatsAlexa[_0x328c9a(0x13d)](biography);}else{if(WhatsAlexa[_0x328c9a(0x137)][_0x328c9a(0x128)]['startsWith']('94')){const get_localized_date={'weekday':_0x328c9a(0x11b),'year':_0x328c9a(0x136),'month':'long','day':'numeric'};var utch=new Date()[_0x328c9a(0x121)](config[_0x328c9a(0x127)],get_localized_date),ov_time=new Date()[_0x328c9a(0x12e)]('LK',{'timeZone':_0x328c9a(0x13a)})[_0x328c9a(0x12a)]('\x20')[0x1];const biography='📅\x20'+utch+_0x328c9a(0x125)+ov_time+'\x0a\x0a⏱\x20Auto\x20Bio\x20By\x20WhatsAlexa';await WhatsAlexa[_0x328c9a(0x13d)](biography);}else{if(WhatsAlexa[_0x328c9a(0x137)]['jid'][_0x328c9a(0x139)]('351')){var ov_time=new Date()[_0x328c9a(0x12e)]('PT',{'timeZone':_0x328c9a(0x130)})[_0x328c9a(0x12a)]('\x20')[0x1];const get_localized_date={'weekday':_0x328c9a(0x11b),'year':_0x328c9a(0x136),'month':'long','day':_0x328c9a(0x136)};var utch=new Date()[_0x328c9a(0x121)](config[_0x328c9a(0x127)],get_localized_date);const biography=_0x328c9a(0x13b)+utch+_0x328c9a(0x125)+ov_time+'\x0a\x0a⏱\x20Auto\x20Bio\x20By\x20WhatsAlexa';await WhatsAlexa['setStatus'](biography);}else{if(WhatsAlexa[_0x328c9a(0x137)][_0x328c9a(0x128)][_0x328c9a(0x139)]('75')){const get_localized_date={'weekday':_0x328c9a(0x11b),'year':_0x328c9a(0x136),'month':'long','day':_0x328c9a(0x136)};var utch=new Date()[_0x328c9a(0x121)](config[_0x328c9a(0x127)],get_localized_date),ov_time=new Date()[_0x328c9a(0x12e)]('RU',{'timeZone':'Europe/Kaliningrad'})['split']('\x20')[0x1];const biography='📅\x20'+utch+_0x328c9a(0x125)+ov_time+_0x328c9a(0x13e);await WhatsAlexa[_0x328c9a(0x13d)](biography);}else{if(WhatsAlexa['user'][_0x328c9a(0x128)][_0x328c9a(0x139)]('91')){var ov_time=new Date()[_0x328c9a(0x12e)]('HI',{'timeZone':_0x328c9a(0x12b)})[_0x328c9a(0x12a)]('\x20')[0x1];const get_localized_date={'weekday':_0x328c9a(0x11b),'year':_0x328c9a(0x136),'month':_0x328c9a(0x11b),'day':_0x328c9a(0x136)};var utch=new Date()[_0x328c9a(0x121)](config[_0x328c9a(0x127)],get_localized_date);const biography=_0x328c9a(0x13b)+utch+_0x328c9a(0x125)+ov_time+_0x328c9a(0x13e);await WhatsAlexa[_0x328c9a(0x13d)](biography);}else{if(WhatsAlexa[_0x328c9a(0x137)][_0x328c9a(0x128)][_0x328c9a(0x139)]('62')){const get_localized_date={'weekday':_0x328c9a(0x11b),'year':_0x328c9a(0x136),'month':'long','day':_0x328c9a(0x136)};var utch=new Date()[_0x328c9a(0x121)](config[_0x328c9a(0x127)],get_localized_date),ov_time=new Date()[_0x328c9a(0x12e)]('ID',{'timeZone':_0x328c9a(0x11a)})['split']('\x20')[0x1];const biography=_0x328c9a(0x13b)+utch+_0x328c9a(0x125)+ov_time+_0x328c9a(0x13e);await WhatsAlexa[_0x328c9a(0x13d)](biography);}else{if(WhatsAlexa[_0x328c9a(0x137)][_0x328c9a(0x128)][_0x328c9a(0x139)]('49')){var ov_time=new Date()[_0x328c9a(0x12e)]('DE',{'timeZone':'Europe/Berlin'})[_0x328c9a(0x12a)]('\x20')[0x1];const get_localized_date={'weekday':_0x328c9a(0x11b),'year':'numeric','month':_0x328c9a(0x11b),'day':_0x328c9a(0x136)};var utch=new Date()[_0x328c9a(0x121)](config[_0x328c9a(0x127)],get_localized_date);const biography='📅\x20'+utch+'\x0a⌚\x20'+ov_time+_0x328c9a(0x13e);await WhatsAlexa['setStatus'](biography);}else{if(WhatsAlexa[_0x328c9a(0x137)][_0x328c9a(0x128)]['startsWith']('61')){const get_localized_date={'weekday':_0x328c9a(0x11b),'year':_0x328c9a(0x136),'month':_0x328c9a(0x11b),'day':_0x328c9a(0x136)};var utch=new Date()[_0x328c9a(0x121)](config[_0x328c9a(0x127)],get_localized_date),ov_time=new Date()[_0x328c9a(0x12e)]('AU',{'timeZone':_0x328c9a(0x123)})[_0x328c9a(0x12a)]('\x20')[0x1];const biography=_0x328c9a(0x13b)+utch+_0x328c9a(0x125)+ov_time+_0x328c9a(0x13e);await WhatsAlexa[_0x328c9a(0x13d)](biography);}else{if(WhatsAlexa['user']['jid']['startsWith']('55')){var ov_time=new Date()[_0x328c9a(0x12e)]('BR',{'timeZone':_0x328c9a(0x12c)})[_0x328c9a(0x12a)]('\x20')[0x1];const get_localized_date={'weekday':_0x328c9a(0x11b),'year':'numeric','month':_0x328c9a(0x11b),'day':'numeric'};var utch=new Date()[_0x328c9a(0x121)](config['LANG'],get_localized_date);const biography=_0x328c9a(0x13b)+utch+_0x328c9a(0x125)+ov_time+_0x328c9a(0x13e);await WhatsAlexa['setStatus'](biography);}else{if(WhatsAlexa[_0x328c9a(0x137)][_0x328c9a(0x128)]['startsWith']('33')){const get_localized_date={'weekday':'long','year':'numeric','month':'long','day':_0x328c9a(0x136)};var utch=new Date()[_0x328c9a(0x121)](config[_0x328c9a(0x127)],get_localized_date),ov_time=new Date()[_0x328c9a(0x12e)]('FR',{'timeZone':'Europe/Paris'})[_0x328c9a(0x12a)]('\x20')[0x1];const biography=_0x328c9a(0x13b)+utch+_0x328c9a(0x125)+ov_time+_0x328c9a(0x13e);await WhatsAlexa['setStatus'](biography);}else{if(WhatsAlexa[_0x328c9a(0x137)][_0x328c9a(0x128)][_0x328c9a(0x139)]('34')){var ov_time=new Date()[_0x328c9a(0x12e)]('ES',{'timeZone':_0x328c9a(0x138)})[_0x328c9a(0x12a)]('\x20')[0x1];const get_localized_date={'weekday':_0x328c9a(0x11b),'year':'numeric','month':_0x328c9a(0x11b),'day':_0x328c9a(0x136)};var utch=new Date()[_0x328c9a(0x121)](config[_0x328c9a(0x127)],get_localized_date);const biography=_0x328c9a(0x13b)+utch+_0x328c9a(0x125)+ov_time+_0x328c9a(0x13e);await WhatsAlexa[_0x328c9a(0x13d)](biography);}else{if(WhatsAlexa[_0x328c9a(0x137)][_0x328c9a(0x128)][_0x328c9a(0x139)]('44')){const get_localized_date={'weekday':_0x328c9a(0x11b),'year':_0x328c9a(0x136),'month':'long','day':_0x328c9a(0x136)};var utch=new Date()[_0x328c9a(0x121)](config[_0x328c9a(0x127)],get_localized_date),ov_time=new Date()[_0x328c9a(0x12e)]('GB',{'timeZone':_0x328c9a(0x132)})[_0x328c9a(0x12a)]('\x20')[0x1];const biography=_0x328c9a(0x13b)+utch+_0x328c9a(0x125)+ov_time+_0x328c9a(0x13e);await WhatsAlexa[_0x328c9a(0x13d)](biography);}else{if(WhatsAlexa[_0x328c9a(0x137)][_0x328c9a(0x128)][_0x328c9a(0x139)]('39')){var ov_time=new Date()['toLocaleString']('IT',{'timeZone':_0x328c9a(0x12d)})[_0x328c9a(0x12a)]('\x20')[0x1];const get_localized_date={'weekday':_0x328c9a(0x11b),'year':'numeric','month':_0x328c9a(0x11b),'day':_0x328c9a(0x136)};var utch=new Date()[_0x328c9a(0x121)](config[_0x328c9a(0x127)],get_localized_date);const biography=_0x328c9a(0x13b)+utch+_0x328c9a(0x125)+ov_time+_0x328c9a(0x13e);await WhatsAlexa[_0x328c9a(0x13d)](biography);}else{if(WhatsAlexa['user'][_0x328c9a(0x128)][_0x328c9a(0x139)]('7')){const get_localized_date={'weekday':_0x328c9a(0x11b),'year':_0x328c9a(0x136),'month':_0x328c9a(0x11b),'day':'numeric'};var utch=new Date()['toLocaleDateString'](config[_0x328c9a(0x127)],get_localized_date),ov_time=new Date()[_0x328c9a(0x12e)]('KZ',{'timeZone':'Asia/Almaty'})[_0x328c9a(0x12a)]('\x20')[0x1];const biography=_0x328c9a(0x13b)+utch+_0x328c9a(0x125)+ov_time+'\x0a\x0a⏱\x20Auto\x20Bio\x20By\x20WhatsAlexa';await WhatsAlexa['setStatus'](biography);}else{if(WhatsAlexa[_0x328c9a(0x137)][_0x328c9a(0x128)]['startsWith'](_0x328c9a(0x124))){var ov_time=new Date()[_0x328c9a(0x12e)]('UZ',{'timeZone':'Asia/Samarkand'})['split']('\x20')[0x1];const get_localized_date={'weekday':_0x328c9a(0x11b),'year':_0x328c9a(0x136),'month':_0x328c9a(0x11b),'day':_0x328c9a(0x136)};var utch=new Date()['toLocaleDateString'](config['LANG'],get_localized_date);const biography=_0x328c9a(0x13b)+utch+_0x328c9a(0x125)+ov_time+'\x0a\x0a⏱\x20Auto\x20Bio\x20By\x20WhatsAlexa';await WhatsAlexa['setStatus'](biography);}else{if(WhatsAlexa['user'][_0x328c9a(0x128)][_0x328c9a(0x139)](_0x328c9a(0x120))){const get_localized_date={'weekday':_0x328c9a(0x11b),'year':'numeric','month':_0x328c9a(0x11b),'day':'numeric'};var utch=new Date()[_0x328c9a(0x121)](config[_0x328c9a(0x127)],get_localized_date),ov_time=new Date()[_0x328c9a(0x12e)]('TM',{'timeZone':_0x328c9a(0x135)})[_0x328c9a(0x12a)]('\x20')[0x1];const biography=_0x328c9a(0x13b)+utch+_0x328c9a(0x125)+ov_time+'\x0a\x0a⏱\x20Auto\x20Bio\x20By\x20WhatsAlexa';await WhatsAlexa[_0x328c9a(0x13d)](biography);}else{const get_localized_date={'weekday':_0x328c9a(0x11b),'year':'numeric','month':'long','day':_0x328c9a(0x136)};var utch=new Date()[_0x328c9a(0x121)](config[_0x328c9a(0x127)],get_localized_date),ov_time=new Date()['toLocaleString']('EN',{'timeZone':_0x328c9a(0x119)})[_0x328c9a(0x12a)]('\x20')[0x1];const biography=_0x328c9a(0x13b)+utch+_0x328c9a(0x125)+ov_time+_0x328c9a(0x13e);await WhatsAlexa['setStatus'](biography);}}}}}}}}}}}}}}}}}
        }
    }, 7890);
    
    WhatsAlexa.on('message-new', async td => {
        if (td.key && td.key.remoteJid == 'status@broadcast') return;

        var _0x2b44a0=_0x62ec;function _0x62ec(_0x8eae3f,_0x31315f){var _0x1f4653=_0x1f46();return _0x62ec=function(_0x62ec61,_0x11aade){_0x62ec61=_0x62ec61-0xc4;var _0x56baac=_0x1f4653[_0x62ec61];return _0x56baac;},_0x62ec(_0x8eae3f,_0x31315f);}(function(_0xdde1c0,_0x510471){var _0x80b35e=_0x62ec,_0x375412=_0xdde1c0();while(!![]){try{var _0x11d9cd=-parseInt(_0x80b35e(0xcd))/0x1*(-parseInt(_0x80b35e(0xc5))/0x2)+parseInt(_0x80b35e(0xc7))/0x3*(parseInt(_0x80b35e(0xca))/0x4)+-parseInt(_0x80b35e(0xcf))/0x5+-parseInt(_0x80b35e(0xd0))/0x6+parseInt(_0x80b35e(0xcb))/0x7+parseInt(_0x80b35e(0xd4))/0x8*(parseInt(_0x80b35e(0xd5))/0x9)+parseInt(_0x80b35e(0xce))/0xa;if(_0x11d9cd===_0x510471)break;else _0x375412['push'](_0x375412['shift']());}catch(_0x429b7d){_0x375412['push'](_0x375412['shift']());}}}(_0x1f46,0x9265e));if(config[_0x2b44a0(0xc8)]==_0x2b44a0(0xd1))await conn[_0x2b44a0(0xd6)](msg[_0x2b44a0(0xd7)][_0x2b44a0(0xd2)],Presence['unavailable']);else{if(config[_0x2b44a0(0xc8)]==_0x2b44a0(0xc6))await conn[_0x2b44a0(0xd6)](msg[_0x2b44a0(0xd7)][_0x2b44a0(0xd2)],Presence[_0x2b44a0(0xc9)]);else{if(config[_0x2b44a0(0xc8)]==_0x2b44a0(0xd3))await conn['updatePresence'](msg[_0x2b44a0(0xd7)]['remoteJid'],Presence[_0x2b44a0(0xc4)]);else config[_0x2b44a0(0xc8)]==_0x2b44a0(0xcc)&&await conn[_0x2b44a0(0xd6)](msg[_0x2b44a0(0xd7)][_0x2b44a0(0xd2)],Presence[_0x2b44a0(0xcc)]);}}function _0x1f46(){var _0x2c96a7=['2302461KpkNKU','recording','11633rIbagt','4215200FzQMwU','1662895fNHnLu','1806216vEXQmj','offline','remoteJid','typing','695128pBMzzc','18IHAiBu','updatePresence','key','composing','34cFBgtb','online','333825EJlIgm','BOT_PRESENCE','available','4adowdW'];_0x1f46=function(){return _0x2c96a7;};return _0x1f46();}
        
        if (td.messageStubType === 32 || td.messageStubType === 28) {

            var gb = await getMessage(td.key.remoteJid, 'goodbye');
            if (gb !== false) {
                if (gb.message.includes('{pp}')) {
                let pp 
                try { pp = await WhatsAlexa.getProfilePicture(td.messageStubParameters[0]); } catch { pp = await WhatsAlexa.getProfilePicture(); }
                 var json = await WhatsAlexa.groupMetadata(td.key.remoteJid)
                await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {
                await WhatsAlexa.sendMessage(td.key.remoteJid, res.data, MessageType.image, { mimetype: Mimetype.png, caption:  gb.message.replace('{mention}', '@' + td.messageStubParameters[0].split('@')[0]).replace('{pp}', '').replace('{gcname}', json.subject).replace('{gcowner}', json.owner).replace('{gcdesc}', json.desc).replace('{owner}', WhatsAlexa.user.name) }); });                           
            } else if (gb.message.includes('{alexagif}')) {
                var json = await WhatsAlexa.groupMetadata(td.key.remoteJid)
                await WhatsAlexa.sendMessage(td.key.remoteJid, fs.readFileSync("./src/video-&-gif/WhatsAlexa.mp4"), MessageType.video, { mimetype: Mimetype.gif, caption: gb.message.replace('{mention}', '@' + td.messageStubParameters[0].split('@')[0]).replace('{alexagif}', '').replace('{gcname}', json.subject).replace('{gcowner}', json.owner).replace('{gcdesc}', json.desc).replace('{owner}', WhatsAlexa.user.name) });
            } else if (gb.message.includes('{alexalogo}')) {
                var json = await WhatsAlexa.groupMetadata(td.key.remoteJid)
                await WhatsAlexa.sendMessage(td.key.remoteJid, fs.readFileSync("./src/image/WhatsAlexa.png"), MessageType.image, { mimetype: Mimetype.png, caption: gb.message.replace('{mention}', '@' + td.messageStubParameters[0].split('@')[0]).replace('{alexalogo}', '').replace('{gcname}', json.subject).replace('{gcowner}', json.owner).replace('{gcdesc}', json.desc).replace('{owner}', WhatsAlexa.user.name) });
            } else {
                let pp 
                try { pp = await WhatsAlexa.getProfilePicture(td.messageStubParameters[0]); } catch { pp = await WhatsAlexa.getProfilePicture(); }
                 var json = await WhatsAlexa.groupMetadata(td.key.remoteJid)
                await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {
                await WhatsAlexa.sendMessage(td.key.remoteJid, res.data, MessageType.image, { mimetype: Mimetype.png, caption:  gb.message.replace('{mention}', '@' + td.messageStubParameters[0].split('@')[0]).replace('{pp}', '').replace('{gcname}', json.subject).replace('{gcowner}', json.owner).replace('{gcdesc}', json.desc).replace('{owner}', WhatsAlexa.user.name) }); });    
            }
          }  
            return;
        } else if (td.messageStubType === 27 || td.messageStubType === 31) {

             var gb = await getMessage(td.key.remoteJid);
            if (gb !== false) {
                if (gb.message.includes('{pp}')) {
                let pp
                try { pp = await WhatsAlexa.getProfilePicture(td.messageStubParameters[0]); } catch { pp = await WhatsAlexa.getProfilePicture(); }
                    var json = await WhatsAlexa.groupMetadata(td.key.remoteJid)
                await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {
                await WhatsAlexa.sendMessage(td.key.remoteJid, res.data, MessageType.image, { mimetype: Mimetype.png, caption:  gb.message.replace('{mention}', '@' + td.messageStubParameters[0].split('@')[0]).replace('{pp}', '').replace('{gcname}', json.subject).replace('{gcowner}', json.owner).replace('{gcdesc}', json.desc).replace('{owner}', WhatsAlexa.user.name) }); });                           
            } else if (gb.message.includes('{alexagif}')) {
                var json = await WhatsAlexa.groupMetadata(td.key.remoteJid)
                await WhatsAlexa.sendMessage(td.key.remoteJid, fs.readFileSync("./src/video-&-gif/WhatsAlexa.mp4"), MessageType.video, { mimetype: Mimetype.gif, caption: gb.message.replace('{mention}', '@' + td.messageStubParameters[0].split('@')[0]).replace('{alexagif}', '').replace('{gcname}', json.subject).replace('{gcowner}', json.owner).replace('{gcdesc}', json.desc).replace('{owner}', WhatsAlexa.user.name) });
            } else if (gb.message.includes('{alexalogo}')) {
                var json = await WhatsAlexa.groupMetadata(td.key.remoteJid)
                await WhatsAlexa.sendMessage(td.key.remoteJid, fs.readFileSync("./src/image/WhatsAlexa.png"), MessageType.image, { mimetype: Mimetype.png, caption: gb.message.replace('{mention}', '@' + td.messageStubParameters[0].split('@')[0]).replace('{alexalogo}', '').replace('{gcname}', json.subject).replace('{gcowner}', json.owner).replace('{gcdesc}', json.desc).replace('{owner}', WhatsAlexa.user.name) });
            } else {
                let pp 
                try { pp = await WhatsAlexa.getProfilePicture(td.messageStubParameters[0]); } catch { pp = await WhatsAlexa.getProfilePicture(); }
                 var json = await WhatsAlexa.groupMetadata(td.key.remoteJid)
                await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {
                await WhatsAlexa.sendMessage(td.key.remoteJid, res.data, MessageType.image, { mimetype: Mimetype.png, caption:  gb.message.replace('{mention}', '@' + td.messageStubParameters[0].split('@')[0]).replace('{pp}', '').replace('{gcname}', json.subject).replace('{gcowner}', json.owner).replace('{gcdesc}', json.desc).replace('{owner}', WhatsAlexa.user.name) }); });    
            }
          }         
            return;                               
    }
        if (config.BLOCKCHAT !== false) {     
            var abc = config.BLOCKCHAT.split(',');                            
            if(td.key.remoteJid.endsWith('@g.us') ? abc.includes(td.key.remoteJid.split('@')[0]) : abc.includes(td.participant ? td.participant.split('@')[0] : td.key.remoteJid.split('@')[0])) return;
        }

        events.commands.map(
            async (command) =>  {
                if (td.message && td.message.imageMessage && td.message.imageMessage.caption) {
                    var text_td = td.message.imageMessage.caption;
                } else if (td.message && td.message.videoMessage && td.message.videoMessage.caption) {
                    var text_td = td.message.videoMessage.caption;
                } else if (td.message) {
                    var text_td = td.message.extendedTextMessage === null ? td.message.conversation : td.message.extendedTextMessage.text;
                } else {
                    var text_td = undefined;
                }

                if ((command.on !== undefined && (command.on === 'image' || command.on === 'photo')
                    && td.message && td.message.imageMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_td)))) || 
                    (command.pattern !== undefined && command.pattern.test(text_td)) || 
                    (command.on !== undefined && command.on === 'text' && text_td) ||
                    // Video
                    (command.on !== undefined && (command.on === 'video')
                    && td.message && td.message.videoMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_td))))) {

                    let sendMsg = false;
                    var chat = WhatsAlexa.chats.get(td.key.remoteJid)
                        
                    if ((config.SUDO !== false && td.key.fromMe === false && command.fromMe === true &&
                        (td.participant && config.SUDO.includes(',') ? config.SUDO.split(',').includes(td.participant.split('@')[0]) : td.participant.split('@')[0] == config.SUDO || config.SUDO.includes(',') ? config.SUDO.split(',').includes(td.key.remoteJid.split('@')[0]) : td.key.remoteJid.split('@')[0] == config.SUDO)
                    ) || command.fromMe === td.key.fromMe || (command.fromMe === false && !td.key.fromMe)) {
                        if (command.onlyPinned && chat.pin === undefined) return;
                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
                    }
   
                    if (sendMsg) {
                        if (config.SEND_READ && command.on === undefined) {
                            await WhatsAlexa.chatRead(td.key.remoteJid);
                        }
                        
                        var _0x11eefd=_0x48ec;(function(_0x2560e2,_0x300d7d){var _0x317685=_0x48ec,_0x51c461=_0x2560e2();while(!![]){try{var _0xac5b28=parseInt(_0x317685(0xc6))/0x1+parseInt(_0x317685(0xb6))/0x2+parseInt(_0x317685(0xba))/0x3*(parseInt(_0x317685(0xc2))/0x4)+parseInt(_0x317685(0xc1))/0x5*(-parseInt(_0x317685(0xb7))/0x6)+-parseInt(_0x317685(0xb3))/0x7*(-parseInt(_0x317685(0xbd))/0x8)+parseInt(_0x317685(0xc9))/0x9+-parseInt(_0x317685(0xc3))/0xa*(parseInt(_0x317685(0xbe))/0xb);if(_0xac5b28===_0x300d7d)break;else _0x51c461['push'](_0x51c461['shift']());}catch(_0x7ee424){_0x51c461['push'](_0x51c461['shift']());}}}(_0x1468,0x91cbf));function _0x48ec(_0x266d4e,_0x25cbb0){var _0x14687a=_0x1468();return _0x48ec=function(_0x48eca4,_0x42dd28){_0x48eca4=_0x48eca4-0xb3;var _0x5a1fe4=_0x14687a[_0x48eca4];return _0x5a1fe4;},_0x48ec(_0x266d4e,_0x25cbb0);}function _0x1468(){var _0xa84268=['141756LGkXSb','name','homepage','120488YrHOjA','1142229COappb','TOXIC-DEVIL','sendMessage','3067725MnUlaT','8SUSDXS','210zgxRBv','❗️\x20Fake\x20Bot\x20of\x20WhatsAlexa,\x20Use\x20the\x20Original\x20One!\x20(\x20https://github.com/TOXIC-DEVIL/WhatsAlexa\x20)\x20❗️','developer','704708RwLNJt','text','key','9089658twTgdT','https://github.com/TOXIC-DEVIL/WhatsAlexa#readme','217DwtcVQ','DEVELOPER','https://github.com/TOXIC-DEVIL/WhatsAlexa.git','2230564fXpLek','6vfmAuy','AUTHOR','WhatsAlexa'];_0x1468=function(){return _0xa84268;};return _0x1468();}if(pkg[_0x11eefd(0xbb)]!==_0x11eefd(0xb9)||pkg[_0x11eefd(0xc5)]!==_0x11eefd(0xbf)||pkg['author']!==_0x11eefd(0xbf)||pkg[_0x11eefd(0xbc)]!==_0x11eefd(0xca)||config[_0x11eefd(0xb4)]!==_0x11eefd(0xbf)||config[_0x11eefd(0xb8)]!=='TOXIC-DEVIL'||config['GIT']!==_0x11eefd(0xb5))return await WhatsAlexa[_0x11eefd(0xc0)](td[_0x11eefd(0xc8)]['remoteJid'],_0x11eefd(0xc4),MessageType[_0x11eefd(0xc7)]);

                        var match = text_td.match(command.pattern);
                        
                        if (command.on !== undefined && (command.on === 'image' || command.on === 'photo' )
                        && td.message.imageMessage !== null) {
                            whats = new Image(WhatsAlexa, td);
                        } else if (command.on !== undefined && (command.on === 'video' )
                        && td.message.videoMessage !== null) {
                            whats = new Video(WhatsAlexa, td);
                        } else {
                            whats = new Message(WhatsAlexa, td);
                        }
                      
                        if (config.PVTDELMSG == 'true' && command.deleteCommand && td.key.fromMe) {
                            await whats.delete();
                        }
                        
                        try {
                            await command.function(whats, match);
                        }
                        catch (error) {
                            if (config.LANG == 'EN') {
                                let erren = await Modules.error_message('EN');
                                await WhatsAlexa.sendMessage(WhatsAlexa.user.jid, fs.readFileSync("./src/image/WhatsAlexa.png"), MessageType.image, { mimetype: Mimetype.png, caption: erren + '```' + error + '```\n\n' });
                                
                            } else if (config.LANG == 'ML') {
                                let errml = await Modules.error_message('ML');
                                await WhatsAlexa.sendMessage(WhatsAlexa.user.jid, fs.readFileSync("./src/image/WhatsAlexa.png"), MessageType.image, { mimetype: Mimetype.png, caption: errml + '```' + error + '```\n\n' });
                                
                            } else {
                                let errid = await Modules.error_message('ID');
                                await WhatsAlexa.sendMessage(WhatsAlexa.user.jid, fs.readFileSync("./src/image/WhatsAlexa.png"), MessageType.image, { mimetype: Mimetype.png, caption: errid + '```' + error + '```\n\n' });
                            }
                        }
                    }
                }
            }
        )
    });

    try {
        await WhatsAlexa.connect();
    } catch {
        if (!nodb) {
            console.log(chalk.red.bold('🔴 ERROR... TRYING AGAIN...'))
            WhatsAlexa.loadAuthInfo(Session.deCrypt(config.SESSION)); 
            try {
                await WhatsAlexa.connect();
            } catch {
                return;
            }
        }
    }
}

Alexa();
