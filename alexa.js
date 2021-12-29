const fs = require("fs");
const path = require("path");
const events = require("./events");
const chalk = require('chalk');
const config = require('./config');
const pkg = require('./package.json');
const axios = require('axios');
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

fs.readdirSync('./plugins/sql/').forEach(plugin => {
    if(path.extname(plugin).toLowerCase() == '.js') {
        require('./plugins/sql/' + plugin);
    }
});

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
    await config.DATABASE.sync();
    var StrSes_Db = await WhatsAlexaDB.findAll({
        where: {
          info: 'StringSession'
        }
    });
   
    const WhatsAlexa = new WAConnection();
    const Session = new StringSession();
    WhatsAlexa.version = [3, 3234, 9];
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
            chalk.blueBright.italic('🔁 CHECKING FOR COMMANDS...')
        );

        const authInfo = WhatsAlexa.base64EncodedAuthInfo();
        if (StrSes_Db.length < 1) {
            await WhatsAlexaDB.create({ info: "StringSession", value: Session.createStringSession(authInfo) });
        } else {
            await StrSes_Db[0].update({ value: Session.createStringSession(authInfo) });
        }
    })    

    WhatsAlexa.on('connecting', async () => {
        console.log(`${chalk.green.bold('WhatsAlexa')}
${chalk.white.bold('Version:')} ${chalk.red.bold(config.VERSION)}
${chalk.blue.italic('Made By TOXIC-DEVIL')}`);
    });
    

    WhatsAlexa.on('open', async () => {
        console.log(
            chalk.green.bold('🛑 NO COMMANDS FOUND!')
        );

        console.log(
            chalk.blueBright.italic('⬇️ INSTALLING COMMANDS...')
        );

        var plugins = await plugindb.PluginDB.findAll();
        plugins.map(async (plugin) => {
          try {
              if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
                  console.log(plugin.dataValues.name);
                  var response = await got(plugin.dataValues.url);
                  if (response.statusCode == 200) {
                      fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
                      require('./plugins/' + plugin.dataValues.name + '.js');
                  }     
              }
          } catch {
              console.log('❌ PLUGIN (' + plugin.dataValues.name + ') HAS BEEN CORRUPTED!')
          }
        });

        console.log(
            chalk.blueBright.italic('✅ COMMANDS INSTALLED SUCCESSFULLY!')
        );

        fs.readdirSync('./plugins').forEach(plugin => {
            if(path.extname(plugin).toLowerCase() == '.js') {
                require('./plugins/' + plugin);
            }
        });

        console.log(
            chalk.green.bold('🎉 BOT IS NOW ACTIVE IN YOUR ACCOUNT!')
        );
        
         if (config.LANG == 'EN') {
             await WhatsAlexa.sendMessage(WhatsAlexa.user.jid, fs.readFileSync("./src/image/WhatsAlexa.png"), MessageType.image, { mimetype: Mimetype.png, caption: `『 WhatsAlexa 』\n\nHello ${WhatsAlexa.user.name}!\n\n*🆘 General Help For You! 🆘*\n\n🔹 *#alive:* Check if the bot is running.\n\n🔹 *#list:* Shows the complete list of commands.\n\n🔹 *#restart:* It Restarts the bot.\n\n🔹 *#shutdown:* It Shutdown/Turn off the bot.\n\n *⚠ Warning, If you shutdown/turn off, there is no command to turn on the bot So You must got to heroku & turn on the worker. ⚠*.\n\nThank You For Using WhatsAlexa 💖`});
             
         } else if (config.LANG == 'ID') {
             await WhatsAlexa.sendMessage(WhatsAlexa.user.jid, fs.readFileSync("./src/image/WhatsAlexa.png"), MessageType.image, { mimetype: Mimetype.png, caption: `『 WhatsAlexa 』\n\nHalo ${WhatsAlexa.user.name}!\n\n*🆘 Bantuan umum 🆘*\n\n🔹 *#alive:* Periksa apakah bot sedang berjalan.\n\n🔹 *#list:* Menampilkan daftar lengkap perintah.\n\n🔹 *#restart:* Ini me-restart bot.\n\n🔹 *#shutdown:* Ini Matikan/Matikan bot.\n\n *⚠ Peringatan, Jika Anda mematikan/mematikan, tidak ada perintah untuk menghidupkan bot Jadi Anda harus pergi ke heroku & Nyalakan worker. ⚠*.\n\nTerima Kasih Telah Menggunakan WhatsAlexa 💖`});
             
         } else {
             await WhatsAlexa.sendMessage(WhatsAlexa.user.jid, fs.readFileSync("./src/image/WhatsAlexa.png"), MessageType.image, { mimetype: Mimetype.png, caption: `『 WhatsAlexa 』\n\nനമസ്കാരം ${WhatsAlexa.user.name}!\n\n*🆘 പൊതുവായ സഹായം 🆘*\n\n🔹 *#alive:* ബോട്ട് പ്രവർത്തിക്കുന്നുണ്ടോയെന്ന് പരിശോധിക്കുന്നു.\n\n🔹 *#list:* കമാൻഡുകളുടെ പൂർണ്ണ ലിസ്റ്റ് കാണിക്കുന്നു.\n\n🔹 *#restart:* ഇത് ബോട്ടിനെ പുനരാരംഭിപ്പിക്കുന്നു.\n\n🔹 *#shutdown:* ഇത് ഷട്ട്ഡൗൺ/ബോട്ട് ഓഫ് ചെയ്യുന്നു.\n\n *⚠ മുന്നറിയിപ്പ്, നിങ്ങൾ ഷട്ട്ഡൗൺ/ഓഫ് ചെയ്യുകയാണെങ്കിൽ, ബോട്ട് ഓണാക്കാൻ ഒരു കമാൻഡും ഇല്ല അതിനാൽ നിങ്ങൾ Heroku ഇല്പോയി worker ഓൺ ചെയ്യണം ⚠*.\n\nWhatsAlexa ഉപയോഗിച്ചതിന് നന്ദി 💖`});
        }
    });
    
    setInterval(async () => { 
        if (config.AUTOBIO == 'true') {
            if (WhatsAlexa.user.jid.startsWith('90')) { 
                var ov_time = new Date().toLocaleString('LK', { timeZone: 'Europe/Istanbul' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
            else if (WhatsAlexa.user.jid.startsWith('994')) { 
                var ov_time = new Date().toLocaleString('AZ', { timeZone: 'Asia/Baku' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
            else if (WhatsAlexa.user.jid.startsWith('94')) { 
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('LK', { timeZone: 'Asia/Colombo' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
            else if (WhatsAlexa.user.jid.startsWith('351')) { 
                var ov_time = new Date().toLocaleString('PT', { timeZone: 'Europe/Lisbon' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
            else if (WhatsAlexa.user.jid.startsWith('75')) { 
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('RU', { timeZone: 'Europe/Kaliningrad' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
            else if (WhatsAlexa.user.jid.startsWith('91')) { 
                var ov_time = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
            else if (WhatsAlexa.user.jid.startsWith('62')) { 
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('ID', { timeZone: 'Asia/Jakarta' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
            else if (WhatsAlexa.user.jid.startsWith('49')) { 
                var ov_time = new Date().toLocaleString('DE', { timeZone: 'Europe/Berlin' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
            else if (WhatsAlexa.user.jid.startsWith('61')) {  
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('AU', { timeZone: 'Australia/Lord_Howe' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
            else if (WhatsAlexa.user.jid.startsWith('55')) { 
                var ov_time = new Date().toLocaleString('BR', { timeZone: 'America/Noronha' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
            else if (WhatsAlexa.user.jid.startsWith('33')) {
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('FR', { timeZone: 'Europe/Paris' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
            else if (WhatsAlexa.user.jid.startsWith('34')) { 
                var ov_time = new Date().toLocaleString('ES', { timeZone: 'Europe/Madrid' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
            else if (WhatsAlexa.user.jid.startsWith('44')) { 
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('GB', { timeZone: 'Europe/London' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
            else if (WhatsAlexa.user.jid.startsWith('39')) {  
                var ov_time = new Date().toLocaleString('IT', { timeZone: 'Europe/Rome' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
            else if (WhatsAlexa.user.jid.startsWith('7')) { 
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('KZ', { timeZone: 'Asia/Almaty' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
            else if (WhatsAlexa.user.jid.startsWith('998')) {  
                var ov_time = new Date().toLocaleString('UZ', { timeZone: 'Asia/Samarkand' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
            else if (WhatsAlexa.user.jid.startsWith('993')) { 
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('TM', { timeZone: 'Asia/Ashgabat' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
            else {
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('EN', { timeZone: 'America/New_York' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n⏱ Auto Bio By WhatsAlexa'
                await WhatsAlexa.setStatus(biography)
            }
        }
    }, 7890);
    
    WhatsAlexa.on('message-new', async td => {
        if (td.key && td.key.remoteJid == 'status@broadcast') return;

        var _0x4f3ecf=_0x3242;function _0x3242(_0x26c161,_0x29edcd){var _0x550a72=_0x550a();return _0x3242=function(_0x324247,_0x5a3888){_0x324247=_0x324247-0x1cc;var _0x15b1f3=_0x550a72[_0x324247];return _0x15b1f3;},_0x3242(_0x26c161,_0x29edcd);}function _0x550a(){var _0x4fbd53=['updatePresence','online','239099wdZUeu','BOT_PRESENCE','1533838mRittB','recording','1319241vRYoVk','1662792ZHghWd','composing','typing','4592330wcDecM','offline','5765992RSBUTR','available','key','remoteJid','4WzEbaA','unavailable','7713174XduhxB'];_0x550a=function(){return _0x4fbd53;};return _0x550a();}(function(_0x368706,_0x575751){var _0xcb37bd=_0x3242,_0x443a4f=_0x368706();while(!![]){try{var _0x44a554=-parseInt(_0xcb37bd(0x1d8))/0x1+parseInt(_0xcb37bd(0x1da))/0x2+-parseInt(_0xcb37bd(0x1dc))/0x3+-parseInt(_0xcb37bd(0x1d3))/0x4*(-parseInt(_0xcb37bd(0x1cd))/0x5)+parseInt(_0xcb37bd(0x1dd))/0x6+-parseInt(_0xcb37bd(0x1d5))/0x7+parseInt(_0xcb37bd(0x1cf))/0x8;if(_0x44a554===_0x575751)break;else _0x443a4f['push'](_0x443a4f['shift']());}catch(_0x340b33){_0x443a4f['push'](_0x443a4f['shift']());}}}(_0x550a,0xdc58a));if(config[_0x4f3ecf(0x1d9)]==_0x4f3ecf(0x1ce))await WhatsAlexa[_0x4f3ecf(0x1d6)](td[_0x4f3ecf(0x1d1)][_0x4f3ecf(0x1d2)],Presence[_0x4f3ecf(0x1d4)]);else{if(config['BOT_PRESENCE']==_0x4f3ecf(0x1d7))await WhatsAlexa[_0x4f3ecf(0x1d6)](td[_0x4f3ecf(0x1d1)][_0x4f3ecf(0x1d2)],Presence[_0x4f3ecf(0x1d0)]);else{if(config[_0x4f3ecf(0x1d9)]==_0x4f3ecf(0x1cc))await WhatsAlexa[_0x4f3ecf(0x1d6)](td[_0x4f3ecf(0x1d1)][_0x4f3ecf(0x1d2)],Presence[_0x4f3ecf(0x1de)]);else config[_0x4f3ecf(0x1d9)]==_0x4f3ecf(0x1db)&&await WhatsAlexa[_0x4f3ecf(0x1d6)](td['key'][_0x4f3ecf(0x1d2)],Presence[_0x4f3ecf(0x1db)]);}}
        
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
        if (config.SUPPORT == '120363039806907810') {     
            var nsup = config.SUPPORT.split(',');                            
            if(td.key.remoteJid.endsWith('@g.us') ? nsup.includes(td.key.remoteJid.split('@')[0]) : nsup.includes(td.participant ? td.participant.split('@')[0] : td.key.remoteJid.split('@')[0])) return;
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
                    if ((OWN.ff == "0" && td.key.fromMe === false && command.fromMe === true &&
                        (td.participant && OWN.ff.includes(',') ? OWN.ff.split(',').includes(td.participant.split('@')[0]) : td.participant.split('@')[0] == OWN.ff || OWN.ff.includes(',') ? OWN.ff.split(',').includes(td.key.remoteJid.split('@')[0]) : td.key.remoteJid.split('@')[0] == OWN.ff)
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
                                await WhatsAlexa.sendMessage(WhatsAlexa.user.jid, fs.readFileSync("./src/image/WhatsAlexa.png"), MessageType.image, { mimetype: Mimetype.png, caption: '*『 ERROR 』*\n\n*WhatsAlexa an error has occurred!*\n_Report this error to the developer [ TOXIC-DEVIL ]._\n\n*Error:* ```' + error + '```\n\n' });
                                
                            } else if (config.LANG == 'ML') {
                                await WhatsAlexa.sendMessage(WhatsAlexa.user.jid, fs.readFileSync("./src/image/WhatsAlexa.png"), MessageType.image, { mimetype: Mimetype.png, caption: '*『 പിശക് 』*\n\n*WhatsAlexa പിശക് സംഭവിച്ചു!*\n_ഈ പിശക് ഡെവലപ്പറെ അറിയിക്കുക [ TOXIC-DEVIL ]._\n\n*പിശക്:* ```' + error + '```\n\n' });
                                
                            } else {
                                await WhatsAlexa.sendMessage(WhatsAlexa.user.jid, fs.readFileSync("./src/image/WhatsAlexa.png"), MessageType.image, { mimetype: Mimetype.png, caption: '*『 KESALAHAN 』*\n\n*WhatsAlexa telah terjadi kesalahan!*\n_Laporkan kesalahan ini ke pengembang [ TOXIC-DEVIL ]._\n\n*Kesalahan:* ```' + error + '```\n\n' });
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
            console.log(chalk.red.bold('ERROR... TRYING AGAIN...'))
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
