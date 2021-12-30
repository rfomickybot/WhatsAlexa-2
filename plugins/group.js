let {MessageType, GroupSettingChange} = require('@adiwajshing/baileys');
let WhatsAlexa = require('../events');
let Config = require('../config');
let Language = require('../language');
let FilterDb = require('./sql/filters');
let FLang = Language.getString('filters');
let Lang = Language.getString('group');
let PLang = Language.getString('profile');
let td = Config.WORKTYPE == 'public' ? false : true

 async function checkUsAdmin(message, user = message.data.participant) {
    var grup = await message.client.groupMetadata(message.jid);
    var sonuc = grup['participants'].map((member) => {     
        if (member.jid.split("@")[0] == user.split("@")[0] && member.isAdmin) return true; else; return false;
    });
    return sonuc.includes(true);
}
async function checkImAdmin(message, user = message.client.user.jid) {
    var grup = await message.client.groupMetadata(message.jid);
    var sonuc = grup['participants'].map((member) => {
        if (member.id.split('@')[0] === user.split('@')[0] && member.isAdmin) return true; else; return false;
    });
    return sonuc.includes(true);
}

WhatsAlexa.addCommand({pattern: 'kick ?(.*)', fromMe: td, onlyGroup: true, desc: Lang.BAN_DESC}, (async (message, match) => { 

    if (Config.WORKTYPE == 'public') {
      var us = await checkUsAdmin(message);
      if (!us) return await message.client.sendMessage(message.jid,Lang.USER_NOT_ADMIN ,MessageType.text);
    }

    var im = await checkImAdmin(message);
    if (!im) return await message.client.sendMessage(message.jid,Lang.IM_NOT_ADMIN,MessageType.text);

    if (Config.BANMSG == 'default') {
        if (message.reply_message !== false) {
            await message.client.sendMessage(message.jid,'@' + message.reply_message.data.participant.split('@')[0] + '```, ' + Lang.BANNED + '```', MessageType.text, {contextInfo: {mentionedJid: [message.reply_message.data.participant]}});
            await message.client.groupRemove(message.jid, [message.reply_message.data.participant]);
        } else if (message.reply_message === false && message.mention !== false) {
            var etiketler = '';
            message.mention.map(async (user) => {
                etiketler += '@' + user.split('@')[0] + ',';
            });

            await message.client.sendMessage(message.jid,etiketler + '```, ' + Lang.BANNED + '```', MessageType.text, {contextInfo: {mentionedJid: message.mention}});
            await message.client.groupRemove(message.jid, message.mention);
        } else {
            return await message.client.sendMessage(message.jid,Lang.GIVE_ME_USER,MessageType.text);
        }
    }
    else {
        if (message.reply_message !== false) {
            await message.client.sendMessage(message.jid,'@' + message.reply_message.data.participant.split('@')[0] + Config.BANMSG, MessageType.text, {contextInfo: {mentionedJid: [message.reply_message.data.participant]}});
            await message.client.groupRemove(message.jid, [message.reply_message.data.participant]);
        } else if (message.reply_message === false && message.mention !== false) {
            var etiketler = '';
            message.mention.map(async (user) => {
                etiketler += '@' + user.split('@')[0] + ',';
            });

            await message.client.sendMessage(message.jid,etiketler + Config.BANMSG, MessageType.text, {contextInfo: {mentionedJid: message.mention}});
            await message.client.groupRemove(message.jid, message.mention);
        } else {
            return await message.client.sendMessage(message.jid,Lang.GIVE_ME_USER,MessageType.text);
        }
    }
}));

WhatsAlexa.addCommand({pattern: 'add(?: |$)(.*)', fromMe: td, onlyGroup: true, desc: Lang.ADD_DESC}, (async (message, match) => { 

    if (Config.WORKTYPE == 'public') {
      var us = await checkUsAdmin(message);
      if (!us) return await message.client.sendMessage(message.jid,Lang.USER_NOT_ADMIN ,MessageType.text);
    }

    var im = await checkImAdmin(message);
    if (!im) return await message.client.sendMessage(message.jid,Lang.IM_NOT_ADMIN,MessageType.text);

    if (match[1] !== '') {
        match[1].split(' ').map(async (user) => {
            await message.client.groupAdd(message.jid, [user + "@s.whatsapp.net"]);
            await message.client.sendMessage(message.jid,'```' + user + ' ' + Lang.ADDED +'```', MessageType.text, {contextInfo: {mentionedJid: user}});
        });
    } else {
        return await message.client.sendMessage(message.jid,Lang.GIVE_ME_USER,MessageType.text);
    }
}));

WhatsAlexa.addCommand({pattern: 'promote ?(.*)', fromMe: td, onlyGroup: true, desc: Lang.PROMOTE_DESC}, (async (message, match) => {   

    if (Config.WORKTYPE == 'public') {
      var us = await checkUsAdmin(message);
      if (!us) return await message.client.sendMessage(message.jid,Lang.USER_NOT_ADMIN ,MessageType.text);
    }

    var im = await checkImAdmin(message);
    if (!im) return await message.client.sendMessage(message.jid,Lang.IM_NOT_ADMIN,MessageType.text);

    if (Config.PROMOTEMSG == 'default') {
        if (message.reply_message !== false) {
            var checkAlready = await checkImAdmin(message, message.reply_message.data.participant);
            if (checkAlready) {
                return await message.client.sendMessage(message.jid,Lang.ALREADY_PROMOTED, MessageType.text);
            }

            await message.client.sendMessage(message.jid,'@' + message.reply_message.data.participant.split('@')[0] + Lang.PROMOTED, MessageType.text, {contextInfo: {mentionedJid: [message.reply_message.data.participant]}});
            await message.client.groupMakeAdmin(message.jid, [message.reply_message.data.participant]);
        } else if (message.reply_message === false && message.mention !== false) {
            var etiketler = '';
            message.mention.map(async (user) => {
                var checkAlready = await checkImAdmin(message, user);
                if (checkAlready) {
                    return await message.client.sendMessage(message.jid,Lang.ALREADY_PROMOTED, MessageType.text);
                }

                etiketler += '@' + user.split('@')[0] + ',';
            });

            await message.client.sendMessage(message.jid,etiketler + Lang.PROMOTED, MessageType.text, {contextInfo: {mentionedJid: message.mention}});
            await message.client.groupMakeAdmin(message.jid, message.mention);
        } else {
            return await message.client.sendMessage(message.jid,Lang.GIVE_ME_USER,MessageType.text);
        }
    }
    else {
        if (message.reply_message !== false) {
            var checkAlready = await checkImAdmin(message, message.reply_message.data.participant);
            if (checkAlready) {
                return await message.client.sendMessage(message.jid,Lang.ALREADY_PROMOTED, MessageType.text);
            }

            await message.client.sendMessage(message.jid,'@' + message.reply_message.data.participant.split('@')[0] + Config.PROMOTEMSG, MessageType.text, {contextInfo: {mentionedJid: [message.reply_message.data.participant]}});
            await message.client.groupMakeAdmin(message.jid, [message.reply_message.data.participant]);
        } else if (message.reply_message === false && message.mention !== false) {
            var etiketler = '';
            message.mention.map(async (user) => {
                var checkAlready = await checkImAdmin(message, user);
                if (checkAlready) {
                    return await message.client.sendMessage(message.jid,Lang.ALREADY_PROMOTED, MessageType.text);
                }

                etiketler += '@' + user.split('@')[0] + ',';
            });

            await message.client.sendMessage(message.jid,etiketler + Config.PROMOTEMSG, MessageType.text, {contextInfo: {mentionedJid: message.mention}});
            await message.client.groupMakeAdmin(message.jid, message.mention);
        } else {
            return await message.client.sendMessage(message.jid,Lang.GIVE_ME_USER,MessageType.text);
        }
    }
}));

WhatsAlexa.addCommand({pattern: 'demote ?(.*)', fromMe: true, onlyGroup: true, desc: Lang.DEMOTE_DESC}, (async (message, match) => {   

    if (Config.WORKTYPE == 'public') {
      var us = await checkUsAdmin(message);
      if (!us) return await message.client.sendMessage(message.jid,Lang.USER_NOT_ADMIN ,MessageType.text);
    }

    var im = await checkImAdmin(message);
    if (!im) return await message.client.sendMessage(message.jid,Lang.IM_NOT_ADMIN);

    if (Config.DEMOTEMSG == 'default') {
        if (message.reply_message !== false) {
            var checkAlready = await checkImAdmin(message, message.reply_message.data.participant.split('@')[0]);
            if (!checkAlready) {
                return await message.client.sendMessage(message.jid,Lang.ALREADY_NOT_ADMIN, MessageType.text);
            }

            await message.client.sendMessage(message.jid,'@' + message.reply_message.data.participant.split('@')[0] + Lang.DEMOTED, MessageType.text, {contextInfo: {mentionedJid: [message.reply_message.data.participant]}});
            await message.client.groupDemoteAdmin(message.jid, [message.reply_message.data.participant]);
        } else if (message.reply_message === false && message.mention !== false) {
            var etiketler = '';
            message.mention.map(async (user) => {
                var checkAlready = await checkImAdmin(message, user);
                if (!checkAlready) {
                    return await message.client.sendMessage(message.jid,Lang.ALREADY_NOT_ADMIN, MessageType.text);
                }

                etiketler += '@' + user.split('@')[0] + ',';
            });

            await message.client.sendMessage(message.jid,etiketler + Lang.DEMOTED, MessageType.text, {contextInfo: {mentionedJid: message.mention}});
            await message.client.groupDemoteAdmin(message.jid, message.mention);
        } else {
            return await message.client.sendMessage(message.jid,Lang.GIVE_ME_USER,MessageType.text);
        }
    }
    else {
        if (message.reply_message !== false) {
            var checkAlready = await checkImAdmin(message, message.reply_message.data.participant.split('@')[0]);
            if (!checkAlready) {
                return await message.client.sendMessage(message.jid,Lang.ALREADY_NOT_ADMIN, MessageType.text);
            }

            await message.client.sendMessage(message.jid,'@' + message.reply_message.data.participant.split('@')[0] + Config.DEMOTEMSG, MessageType.text, {contextInfo: {mentionedJid: [message.reply_message.data.participant]}});
            await message.client.groupDemoteAdmin(message.jid, [message.reply_message.data.participant]);
        } else if (message.reply_message === false && message.mention !== false) {
            var etiketler = '';
            message.mention.map(async (user) => {
                var checkAlready = await checkImAdmin(message, user);
                if (!checkAlready) {
                    return await message.client.sendMessage(message.jid,Lang.ALREADY_NOT_ADMIN, MessageType.text);
                }

                etiketler += '@' + user.split('@')[0] + ',';
            });

            await message.client.sendMessage(message.jid,etiketler + Config.DEMOTEMSG, MessageType.text, {contextInfo: {mentionedJid: message.mention}});
            await message.client.groupDemoteAdmin(message.jid, message.mention);
        } else {
            return await message.client.sendMessage(message.jid,Lang.GIVE_ME_USER,MessageType.text);
        }
    }
}));

WhatsAlexa.addCommand({pattern: 'closegc ?(.*)', fromMe: td, onlyGroup: true, desc: Lang.MUTE_DESC}, (async (message, match) => {  

    if (Config.WORKTYPE == 'public') {
      var us = await checkUsAdmin(message);
      if (!us) return await message.client.sendMessage(message.jid,Lang.USER_NOT_ADMIN ,MessageType.text);
    }

    var im = await checkImAdmin(message);
    if (!im) return await message.client.sendMessage(message.jid,Lang.IM_NOT_ADMIN,MessageType.text);

    if (Config.MUTEMSG == 'default') {
        await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
        await message.client.sendMessage(message.jid,Lang.MUTED,MessageType.text);
    }
    else {
        await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
        await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);
    }
}));

WhatsAlexa.addCommand({pattern: 'opengc ?(.*)', fromMe: td, onlyGroup: true, desc: Lang.UNMUTE_DESC}, (async (message, match) => {   

    if (Config.WORKTYPE == 'public') {
      var us = await checkUsAdmin(message);
      if (!us) return await message.client.sendMessage(message.jid,Lang.USER_NOT_ADMIN ,MessageType.text);
    }

    var im = await checkImAdmin(message);
    if (!im) return await message.client.sendMessage(message.jid,Lang.IM_NOT_ADMIN,MessageType.text);

    if (Config.UNMUTEMSG == 'default') {
        await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
        await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
    }
    else {
        await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
        await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
    }
}));

WhatsAlexa.addCommand({pattern: 'linkgc ?(.*)', fromMe: td, onlyGroup: true, desc: Lang.INVITE_DESC}, (async (message, match) => {   

    if (Config.WORKTYPE == 'public') {
      var us = await checkUsAdmin(message);
      if (!us) return await message.client.sendMessage(message.jid,Lang.USER_NOT_ADMIN ,MessageType.text);
    }

    var im = await checkImAdmin(message);
    if (!im) return await message.client.sendMessage(message.jid,Lang.IM_NOT_ADMIN, MessageType.text);
    
    var invite = await message.client.groupInviteCode(message.jid);
    await message.client.sendMessage(message.jid,Lang.INVITE + ' https://chat.whatsapp.com/' + invite, MessageType.text);
}));

WhatsAlexa.addCommand({pattern: 'revoke ?(.*)', onlyGroup: true, fromMe: td, desc: Lang.REVOKE_DESC}, (async (message, match) => {

    if (Config.WORKTYPE == 'public') {
      var us = await checkUsAdmin(message);
      if (!us) return await message.client.sendMessage(message.jid,Lang.USER_NOT_ADMIN ,MessageType.text);
    }

    var im = await checkImAdmin(message);
    if (!im) return await message.sendReply(Lang.IAM_NOT_ADMIN)
    await message.client.revokeInvite(message.jid)
    await message.sendReply(Lang.SUC_REVOKED)
}))

WhatsAlexa.addCommand({pattern: 'setgcname ?(.*)', onlyGroup: true, fromMe: td, desc: Lang.SET_NAME_DESC}, (async (message, match) => {

    if (Config.WORKTYPE == 'public') {
      var us = await checkUsAdmin(message);
      if (!us) return await message.client.sendMessage(message.jid,Lang.USER_NOT_ADMIN ,MessageType.text);
    }

    var im = await checkImAdmin(message);
    if (!im) return await message.sendReply(Lang.IAM_NOT_ADMIN);
    
    if (match[1] === '') return await message.sendReply(Lang.S_NEED_WORD);
    await message.client.groupUpdateSubject(message.jid, match[1]);
    await message.sendReply(Lang.SUC_SNAME + '```' + match[1] + '```');
    }
));

WhatsAlexa.addCommand({pattern: 'setdesc ?(.*)', fromMe: td, desc: Lang.SETDESC_DESC}, (async (message, match) => {

    if (Config.WORKTYPE == 'public') {
      var us = await checkUsAdmin(message);
      if (!us) return await message.client.sendMessage(message.jid,Lang.USER_NOT_ADMIN ,MessageType.text);
    }

    var im = await checkImAdmin(message);
    if (!im) return await message.sendReply(Lang.IAM_NOT_ADMIN);

    function _0x2d48(_0x36f677,_0x34d885){const _0x1221cb=_0x1221();return _0x2d48=function(_0x2d48a7,_0xae69fb){_0x2d48a7=_0x2d48a7-0x1b4;let _0x274bcc=_0x1221cb[_0x2d48a7];return _0x274bcc;},_0x2d48(_0x36f677,_0x34d885);}const _0x3b6b7e=_0x2d48;(function(_0x3dcf7c,_0x23a3e5){const _0x1f2c5f=_0x2d48,_0x553485=_0x3dcf7c();while(!![]){try{const _0x30b1dc=-parseInt(_0x1f2c5f(0x1be))/0x1*(parseInt(_0x1f2c5f(0x1b4))/0x2)+-parseInt(_0x1f2c5f(0x1c2))/0x3+parseInt(_0x1f2c5f(0x1bf))/0x4+-parseInt(_0x1f2c5f(0x1bd))/0x5*(parseInt(_0x1f2c5f(0x1bc))/0x6)+-parseInt(_0x1f2c5f(0x1b7))/0x7+-parseInt(_0x1f2c5f(0x1b9))/0x8+parseInt(_0x1f2c5f(0x1b8))/0x9*(parseInt(_0x1f2c5f(0x1c0))/0xa);if(_0x30b1dc===_0x23a3e5)break;else _0x553485['push'](_0x553485['shift']());}catch(_0x1864be){_0x553485['push'](_0x553485['shift']());}}}(_0x1221,0xf044b));function _0x1221(){const _0x44a2d6=['8464526DYdMuO','6750RLfImJ','1659960dUuvKU','text','reply_message','5251746MdOHpI','10LtbwgR','717967DaPaPN','4643444xsMuCq','53370npbaTy','groupUpdateDescription','882630dCvIOK','SUC_SETDESC','sendReply','2Xlccry','NEED_WORDS_DESC','client'];_0x1221=function(){return _0x44a2d6;};return _0x1221();}let text;if(match[0x1]!==''&&message['reply_message'])text=match[0x1];else{if(!message['reply_message']&&match[0x1]!=='')text=match[0x1];else{if(match[0x1]===''&&message[_0x3b6b7e(0x1bb)])text=message['reply_message'][_0x3b6b7e(0x1ba)];else match[0x1]===''&&!message[_0x3b6b7e(0x1bb)]&&await message['sendReply'](Lang[_0x3b6b7e(0x1b5)]);}}await message[_0x3b6b7e(0x1b6)][_0x3b6b7e(0x1c1)](message['jid'],text),await message[_0x3b6b7e(0x1c4)](Lang[_0x3b6b7e(0x1c3)]);

}));

WhatsAlexa.addCommand({pattern: 'setgcpp ?(.*)', onlyGroup: true, fromMe: td, desc: Lang.SETPP_DESC}, (async (message, match) => {

    if (Config.WORKTYPE == 'public') {
      var us = await checkUsAdmin(message);
      if (!us) return await message.client.sendMessage(message.jid,Lang.USER_NOT_ADMIN ,MessageType.text);
    }

    var im = await checkImAdmin(message);
    if (!im) return await message.sendReply(Lang.IAM_NOT_ADMIN);
   
    var _0x26e7b3=_0x5c77;(function(_0x116e7e,_0x4c737e){var _0x59dfca=_0x5c77,_0x479b52=_0x116e7e();while(!![]){try{var _0x231838=-parseInt(_0x59dfca(0x17e))/0x1*(parseInt(_0x59dfca(0x17a))/0x2)+-parseInt(_0x59dfca(0x17d))/0x3+-parseInt(_0x59dfca(0x178))/0x4+-parseInt(_0x59dfca(0x174))/0x5+parseInt(_0x59dfca(0x17c))/0x6*(parseInt(_0x59dfca(0x176))/0x7)+parseInt(_0x59dfca(0x181))/0x8+-parseInt(_0x59dfca(0x185))/0x9*(-parseInt(_0x59dfca(0x17f))/0xa);if(_0x231838===_0x4c737e)break;else _0x479b52['push'](_0x479b52['shift']());}catch(_0x1b1fd8){_0x479b52['push'](_0x479b52['shift']());}}}(_0xb2af,0xe9c90));if(message[_0x26e7b3(0x183)]===![]||message['reply_message'][_0x26e7b3(0x173)]===![])return await message['sendReply'](PLang[_0x26e7b3(0x184)]);function _0x5c77(_0x4aa21d,_0x5c9716){var _0xb2affc=_0xb2af();return _0x5c77=function(_0x5c774b,_0x2724e9){_0x5c774b=_0x5c774b-0x172;var _0x256d7b=_0xb2affc[_0x5c774b];return _0x256d7b;},_0x5c77(_0x4aa21d,_0x5c9716);}var location=await message['client']['downloadAndSaveMediaMessage']({'key':{'remoteJid':message[_0x26e7b3(0x183)][_0x26e7b3(0x172)],'id':message[_0x26e7b3(0x183)]['id']},'message':message[_0x26e7b3(0x183)][_0x26e7b3(0x175)]['quotedMessage']});await message[_0x26e7b3(0x180)][_0x26e7b3(0x177)](message[_0x26e7b3(0x172)],fs[_0x26e7b3(0x179)](location)),await message[_0x26e7b3(0x182)](Lang[_0x26e7b3(0x17b)]);function _0xb2af(){var _0x477ecc=['42fKNmnD','updateProfilePicture','6681576ZvGyDM','readFileSync','2ApcfTz','SUC_SETPP','725148IwPZbO','1163175RlnORX','806791GEWnMc','10vuodcG','client','12768328SCIusr','sendReply','reply_message','NEED_PHOTO','20717685mPtSNN','jid','image','4003300zaaHAu','data'];_0xb2af=function(){return _0x477ecc;};return _0xb2af();}
}));

module.exports = {
    checkImAdmin: checkImAdmin
};
