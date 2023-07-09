
"use strict";
const { BufferJSON,
  WA_DEFAULT_EPHEMERAL,
  proto,
  prepareWAMessageMedia,
  areJidsSameUser,
  getContentType } = require('@adiwajshing/baileys')
const { downloadContentFromMessage,
  generateWAMessage,
  generateWAMessageFromContent,
  MessageType } = require("@adiwajshing/baileys")
const { exec, spawn } = require("child_process");
const { color, bgcolor, pickRandom, randomNomor } = require('./function/Data_Server_Bot/Console_Data')
const { removeEmojis, bytesToSize, getBuffer, fetchJson, getRandom, getGroupAdmins, runtime, sleep, makeid, isUrl } = require("./function/func_Server");
const { TelegraPh } = require("./function/uploader_Media");
const { addResponList, delResponList, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('./function/func_Addlist');
const { mess_JSON, setting_JSON, server_eror_JSON, db_respon_list_JSON } = require('./function/Data_Location.js')
const { mediafireDl } = require('./function/scrape_Mediafire')
const { webp2mp4File } = require("./function/Webp_Tomp4")
const { jadibot, listJadibot } = require('./function/jadibot')

//module
const { instagram, youtube, tiktok } = require("@xct007/frieren-scraper")
const { File } = require("megajs")
const { youtubedl } = require("@bochilteam/scraper-sosmed")


const fs = require("fs");
const ms = require("ms");
const chalk = require('chalk');
const axios = require("axios");
const qs = require("querystring");
const fetch = require("node-fetch");
const colors = require('colors/safe');
const ffmpeg = require("fluent-ffmpeg");
const moment = require("moment-timezone");
const util = require("util");
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');

// DB
const mess = mess_JSON
const setting = setting_JSON
const server_eror = server_eror_JSON
const db_respon_list = db_respon_list_JSON

moment.tz.setDefault("Asia/Jakarta").locale("id");
module.exports = async (conn, msg, m, setting, store) => {
  try {
    const { type, quotedMsg, mentioned, now, fromMe, isBaileys } = msg
    if (msg.isBaileys) return
    const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
    const tanggal = moment().tz("Asia/Jakarta").format("ll")
    let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
    const ucapanWaktu = "Selamat " + dt.charAt(0).toUpperCase() + dt.slice(1)
    const content = JSON.stringify(msg.message)
    const from = msg.key.remoteJid
    const time = moment(new Date()).format("HH:mm");
    var chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
    if (chats == undefined) { chats = 'undifined' }
    const prefix = setting.prefix
    const isGroup = msg.key.remoteJid.endsWith('@g.us')
    const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
    const isOwner = [`${setting.ownerNumber}`, "6281234795656@s.whatsapp.net", "6281234795656@s.whatsapp.net"].includes(sender) ? true : false
    const pushname = msg.pushName
    const body = chats.startsWith(prefix) ? chats : ''
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(" ");
    const isCommand = body.startsWith(prefix);
    const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
    const isCmd = isCommand ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
    const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'

    const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
    const groupName = isGroup ? groupMetadata.subject : ''
    const groupId = isGroup ? groupMetadata.id : ''
    const participants = isGroup ? await groupMetadata.participants : ''
    const groupMembers = isGroup ? groupMetadata.participants : ''
    const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
    const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
    const isGroupAdmins = groupAdmins.includes(sender)

    const quoted = msg.quoted ? msg.quoted : msg

    const isImage = (type == 'imageMessage')
    const isQuotedMsg = (type == 'extendedTextMessage')
    const isMedia = (type === 'imageMessage' || type === 'videoMessage');
    const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
    const isVideo = (type == 'videoMessage')
    const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
    const isSticker = (type == 'stickerMessage')
    const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false
    const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false

    const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
    const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
    const mention = typeof (mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
    mention != undefined ? mention.push(mentionByReply) : []
    const mentionUser = mention != undefined ? mention.filter(n => n) : []

    await conn.sendPresenceUpdate('unavailable', from)

    try {
      var pp_user = await conn.profilePictureUrl(sender, 'image')
    } catch {
      var pp_user = 'https://i.ibb.co/0M6Hppv/3626e36344a1.jpg'
    }

    function mentions(teks, mems = [], id) {
      if (id == null || id == undefined || id == false) {
        let res = conn.sendMessage(from, { text: teks, mentions: mems })
        return res
      } else {
        let res = conn.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
        return res
      }
    }

    function monospace(string) {
      return '```' + string + '```'
    }

    const more = String.fromCharCode(8206)
    const readmore = more.repeat(4001)

    function parseMention(text = '') {
      return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }

    const isEmoji = (emo) => {
      let emoji_ranges = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
      let regexEmoji = new RegExp(emoji_ranges, 'gi');
      return emo.match(regexEmoji)
    }

    const reply = (teks) => { conn.sendMessage(from, { text: teks }, { quoted: msg }) }

    const adReply = async (teks, judul, isi, quo) => {
      conn.sendMessage(from, {
        text: teks,
        contextInfo: {
          "externalAdReply":
          {
            showAdAttribution: true,
            title: judul,
            body: isi,
            mediaType: 3, "thumbnail":
              fs.readFileSync('./sticker/adreply.jpg'),
            sourceUrl: 'https://github.com/dragneel1111/Simple-Selfbot'
          }
        }
      },
        {
          sendEphemeral: true,
          quoted: quo
        })
    }

    const menugif = async (teks, pid, judul, isi, quo) => {
      await conn.sendMessage(from, {
        video: pid,
        gifPlayback: true,
        caption: teks,
        contextInfo: {
          forwardingScore: 9999,
          externalAdReply: {
            showAdAttribution: true,
            title: judul,
            body: isi,
            description: setting.group.judul,
            thumbnail: fs.readFileSync('./sticker/adreply.jpg'),
            sourceUrl: 'https://github.com/dragneel1111/Simple-Selfbot'
          }
        }
      }, { quoted: quo })
    }

    const ftokoo = {
      key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        ...(from ? { remoteJid: "16505434800@s.whatsapp.net" } : {}),
      },
      message: {
        productMessage: {
          product: {
            productImage: {
              mimetype: "image/jpeg",
              jpegThumbnail: fs.readFileSync('./sticker/thumb.jpg'),
            },
            title: setting.group.judul,
            description: `a`,
            currencyCode: "USD",
            priceAmount1000: `111111`,
            retailerId: "a",
            productImageCount: 1,
          },
          businessOwnerJid: `0@s.whatsapp.net`,
        },
      },
    };

    const adOwner = async (quo) => {
      conn.sendMessage(from, {
        text: `https://api.whatsapp.com/send/?phone=${setting.ChatOwner}&text=Hai+orang+ganteng%3Av&type=phone_number&app_absent=0`,
        contextInfo: {
          "externalAdReply":
          {
            showAdAttribution: true,
            title: setting.ownerName,
            body: ``,
            mediaType: 3, "thumbnail":
              fs.readFileSync('./sticker/adreply.jpg'),
            sourceUrl: `https://api.whatsapp.com/send/?phone=${setting.ChatOwner}&text=Hai+orang+ganteng%3Av&type=phone_number&app_absent=0`
          }
        }
      },
        {
          sendEphemeral: true,
          quoted: quo
        })
    }

    /*const ttdl = async (ling) => {
      let urltt = ling
      function getVideoInfo(urltt) {
        return new Promise(async (resolve, reject) => {
          try {
            await axios
              .get(`https://www.tikwm.com/api/?url=${urltt}?hd=1`)
              .then((response) => {
                resolve(response.data.data)
              });
          } catch (error) {
            resolve(error);
          }
        })
      };
      getVideoInfo(urltt)
    }*/

    if (!isCmd && isGroup && isAlreadyResponList(from, chats, db_respon_list)) {
      var get_data_respon = getDataResponList(from, chats, db_respon_list)
      if (get_data_respon.isImage === false) {
        adReply(sendResponList(from, chats, db_respon_list), groupName, tanggal, msg)
      } else {
        conn.sendMessage(from, { image: await getBuffer(get_data_respon.image_url), caption: get_data_respon.response }, {
          quoted: msg
        })
      }
    }

    const sendContact = (jid, numbers, name, quoted, mn) => {
      let number = numbers.replace(/[^0-9]/g, '')
      const vcard = 'BEGIN:VCARD\n'
        + 'VERSION:3.0\n'
        + 'FN:' + name + '\n'
        + 'ORG:;\n'
        + 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
        + 'END:VCARD'
      return conn.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions: mn ? mn : [] }, { quoted: quoted })
    }

    // Logs cmd
    if (!isGroup && isCmd) {
      console.log(color('[COMMAND PC]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'white'), color(`${command} [${args.length}]`), 'from', color(pushname))
    }
    if (isGroup && isCmd) {
      console.log(color('[COMMAND GC]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'white'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName))
    }

    // Logs chats
    if (!isGroup && !fromMe && chats && !isSticker && !isMedia) {
      if (!chats.slice(100)) {
        console.log(color('[CHAT PC]', 'red'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'white'), color(`${chats}`, 'yellow'), 'from', color(from))
      } else if (chats.slice(100)) {
        console.log(color('[CHAT PC]', 'red'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'white'), color(`LONG TEXT`, 'red'), 'from', color(from))
      }
    }
    if (isGroup && !fromMe && chats && !isSticker && !isMedia) {
      if (!chats.slice(100)) {
        console.log(color('[CHAT GC]', 'yellow'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'white'), color(`${chats}`, 'yellow'), 'from', color(sender), 'in', color(groupName))
      } else if (chats.slice(100)) {
        console.log(color('[CHAT GC]', 'yellow'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'white'), color(`LONG TEXT`, 'red'), 'from', color(sender), 'in', color(groupName))
      }
    }

    // Eval
    if (chats.startsWith("> ") && fromMe && isOwner) {
      console.log(color('[EVAL]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`From Owner`))
      try {
        let evaled = await eval(chats.slice(1))
        if (typeof evaled !== 'string') evaled = require("util").inspect(evaled)
        reply(`${evaled}`)
      } catch (err) {
        console.log(color('[EVAL]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkoakwoak`))
        const ev = (sul) => {
          var sat = JSON.stringify(sul, null, 2)
          var bang = util.format(sat)
          if (sat == undefined) {
            bang = util.format(sul)
          }
          return reply(bang)
        }
        try {
          reply(util.format(eval(`;(async () => { ${chats.slice(1)} })()`)))
        } catch (e) {
          reply(util.format(e))
        }
      }
    }

    if (!fromMe) return

    if (chats.startsWith("Test")) {
      adReply(`*SELFBOT ONLINE* ✅

• Botname : ${setting.botName}
• Library : Baileys
• Prefix : ${prefix}
• Creator : ${setting.ownerName}
• Runtime : ${runtime(process.uptime())}
• Source Code :
https://github.com/dragneel1111/Simple-Selfbot
`,
        `${tanggal}`, `${jam}`, ftokoo)
      console.log(color(`[ RUNTIME: ${runtime(process.uptime())} ] ${tanggal}`, 'cyan'))
    }


    switch (command) {

      case 'menu': case 'help':
        if (!q) {
          var cptn = `*Just Simple Selfbot*\n${readmore}\n`
          cptn += `_Convert_\n`
          cptn += `• ${prefix}sticker\n`
          cptn += `• ${prefix}toimg\n`
          cptn += `• ${prefix}tovideo\n`
          cptn += `• ${prefix}toaudio\n`
          cptn += `• ${prefix}take\n`
          cptn += `• ${prefix}stickermeme\n\n`
          cptn += `_Downloader_\n`
          cptn += `• ${prefix}play\n`
          cptn += `• ${prefix}ytsearch\n`
          cptn += `• ${prefix}ytmp3\n`
          cptn += `• ${prefix}ytmp4\n`
          cptn += `• ${prefix}igdl\n`
          cptn += `• ${prefix}tiktok\n`
          cptn += `• ${prefix}mediafire\n`
          cptn += `• ${prefix}mega\n\n`
          cptn += `_Weaboo_\n`
          cptn += `• ${prefix}genshin\n`
          cptn += `• ${prefix}ppcp\n`
          cptn += `• ${prefix}otakudesu latest\n`
          cptn += `• ${prefix}otakudesu detail\n\n`
          cptn += `_Tools_\n`
          cptn += `• ${prefix}creator\n`
          cptn += `• ${prefix}tourl\n`
          cptn += `• ${prefix}infogroup\n`
          cptn += `• ${prefix}reply\n`
          cptn += `• ${prefix}readmore\n`
          cptn += `• ${prefix}hidetag\n`
          cptn += `• ${prefix}ssweb\n\n`
          cptn += `${setting.group.judul}\n_Create by ${setting.ownerName}_\n_Since 01-12-2020_`
          var vid = fs.readFileSync('./sticker/menu.mp4')
          menugif(cptn, vid, `${tanggal}`, `${jam}`, ftokoo)
        } else if (q.includes('owner')) {
          var cptn = `_Owner Tools_\n`
          cptn += `• ${prefix}setprefix\n`
          cptn += `• ${prefix}setmenu\n`
          cptn += `• ${prefix}setadreply\n`
          cptn += `• ${prefix}setthumb\n`
          cptn += `• ${prefix}error\n`
          cptn += `• ${prefix}clear\n`
          cptn += `• ${prefix}sendsesi\n`
          cptn += `• ${prefix}addrespon\n`
          cptn += `• ${prefix}delrespon\n`
          cptn += `• ${prefix}setppbot\n`
          cptn += `• ${prefix}setppgc\n`
          cptn += `• ${prefix}addsession\n`
          adReply(cptn, tanggal, jam)
        }
        break

      case 'runtime':
      case 'tes':
        reply(`*Runtime :* ${runtime(process.uptime())}`)
        break
      case 'owner':
      case 'creator':
        var owner_Nya = setting.ChatOwner
        sendContact(from, owner_Nya, setting.ownerName, msg)
        adOwner(ftokoo)
        break

      // DOWNLOADER
      case 'mega':
        if (!q) return reply(`example:\n${prefix + command} https://mega.nz/file/0FUA2bzb#vSu3Ud9Ft_HDz6zPvfIg_y62vE1qF8EmoYT3kY16zxo`)
        var file = File.fromURL(q)
        await file.loadAttributes()
        adReply(`*_Please wait a few minutes..._*`, file.name, 'downloading...')
        var data = await file.downloadBuffer()
        if (/mp4/.test(data)) {
          await conn.sendMessage(from, { document: data, mimetype: "video/mp4", fileName: `${file.name}.mp4` }, { quoted: msg })
        } else if (/pdf/.test(data)) {
          await conn.sendMessage(from, { document: data, mimetype: "application/pdf", fileName: `${file.name}.pdf` }, { quoted: msg })
        }
        break

      case 'instagram':
      case 'igdl':
      case 'ig':
        if (!q) return reply(`example:\n${prefix + command} https://www.instagram.com/reel/Cs3wXG-goqR/?igshid=MzRlODBiNWFlZA==`)
        var data = await instagram.v1(`${q}`)
        var hasil = await getBuffer(data[0].url)
        if (/mp4/.test(hasil)) {
          await conn.sendMessage(from, {
            video: hasil, contextInfo: {
              "externalAdReply":
              {
                showAdAttribution: true,
                title: "Instagram Downloader",
                body: "",
                mediaType: 3, "thumbnail":
                  fs.readFileSync('./sticker/adreply.jpg'),
                sourceUrl: 'https://github.com/dragneel1111/Simple-Selfbot'
              }
            }
          })
        } else {
          await conn.sendMessage(from, {
            image: hasil,
            contextInfo: {
              "externalAdReply":
              {
                showAdAttribution: true,
                title: "Instagram Downloader",
                body: "",
                mediaType: 3, "thumbnail":
                  fs.readFileSync('./sticker/adreply.jpg'),
                sourceUrl: 'https://github.com/dragneel1111/Simple-Selfbot'
              }
            }
          })
        }
        break

      case 'play':
      case 'ytplay':
        if (!q) return reply(`example:\n${prefix + command} kokoronashi`)
        var ytplay = await youtube.search(q)
        var data = await youtubedl(ytplay[5].url)
        var url = await data.audio['128kbps'].download()
        var hasil = await getBuffer(url)
        await conn.sendMessage(from, {audio: hasil, mimetype: "audio/mp4"}, {quoted: ftokoo})
        await conn.sendMessage(from, {
          document: hasil,
          mimetype: "audio/mp4",
          fileName: `${data.title}.mp3`,
          jpegThumbnail: fs.readFileSync('./sticker/thumb.jpg'),
          contextInfo: {
            "externalAdReply":
            {
              showAdAttribution: true,
              title: "YouTube Downloader",
              body: "",
              mediaType: 3, "thumbnail":
                fs.readFileSync('./sticker/adreply.jpg'),
              sourceUrl: 'https://github.com/dragneel1111/Simple-Selfbot'
            }
          }
        })
        break

      case 'ytmp3':
      case 'mp3':
        if (!q) return reply(`example\n${prefix + command} https://youtu.be/Pp2p4WABjos`)
        var data = await youtubedl(q)
        var url = await data.audio['128kbps'].download()
        var hasil = await getBuffer(url)
        await conn.sendMessage(from, {
          document: hasil,
          mimetype: "audio/mp4",
          fileName: `${data.title}.mp3`,
          jpegThumbnail: fs.readFileSync('./sticker/thumb.jpg'),
          contextInfo: {
            "externalAdReply":
            {
              showAdAttribution: true,
              title: "YouTube Audio Downloader",
              body: "",
              mediaType: 3, "thumbnail":
                fs.readFileSync('./sticker/adreply.jpg'),
              sourceUrl: 'https://github.com/dragneel1111/Simple-Selfbot'
            }
          }
        })
        await sleep(500)
        await conn.sendMessage(from, { audio: hasil, mimetype: "audio/mp4" }, { quoted: ftokoo })
        break
      case 'ytmp4':
      case 'mp4':
        if (!q) return reply(`example\n${prefix + command} https://youtu.be/Pp2p4WABjos`)
        var data = await youtubedl(q)
        var url = await data.video['480p'].download()
        var hasil = await getBuffer(url)
        await conn.sendMessage(from, {
          video: hasil,
          contextInfo: {
            "externalAdReply":
            {
              showAdAttribution: true,
              title: "YouTube Video Downloader",
              body: "",
              mediaType: 3, "thumbnail":
                fs.readFileSync('./sticker/adreply.jpg'),
              sourceUrl: 'https://github.com/dragneel1111/Simple-Selfbot'
            }
          }
        })
        break
      case 'ytsearch':
      case 'yts':
        if (!q) return reply(`example:\n${prefix + command} Tekotok`)
        var data = await youtube.search(q)
        var cptn = `_*Result of ${q}*_\n\n`
        for (let y of data) {
          cptn += `• title: ${y.title}\n`
          cptn += `• duration: ${y.duration}\n`
          cptn += `• uploaded: ${y.uploaded}\n`
          cptn += `• views: ${y.views}\n`
          cptn += `• url: ${y.url}\n\n`
        }
        adReply(cptn, 'Youtube Search', q)
        break

      case 'tiktok':
        if (!q) return reply('example :\n#tiktok https://vt.tiktok.com/ZSLFmra4y/')
        var data = await tiktok.v1(q)
        var hasil = await getBuffer(data.hdplay)
        var cptn = `*Tiktok Downloader*\n\n`
        cptn += `*Nickname:* ${data.nickname}\n`
        cptn += `*Duration:* ${data.duration}\n`
        cptn += `*Description:* ${data.description}\n`
        await conn.sendMessage(from, {
          video: hasil,
          caption: cptn,
          contextInfo: {
            "externalAdReply":
            {
              showAdAttribution: true,
              title: "Tiktok Video Downloader",
              body: "",
              mediaType: 3, "thumbnail":
                fs.readFileSync('./sticker/adreply.jpg'),
              sourceUrl: 'https://github.com/dragneel1111/Simple-Selfbot'
            }
          }
        })
        break

      case 'mediafire':
        if (!q) return reply('*example:*\n#mediafire https://www.mediafire.com/file/451l493otr6zca4/V4.zip/file')
        let isLinks = q.match(/(?:https?:\/{2})?(?:w{3}\.)?mediafire(?:com)?\.(?:com|be)(?:\/www\?v=|\/)([^\s&]+)/)
        if (!isLinks) return reply('Invalid Link')
        reply('*Uploading Media...*')
        let baby1 = await mediafireDl(`${isLinks}`)
        //if (baby1[0].size.split('MB')[0] >= 1000) return reply('File Melebihi Batas ' + util.format(baby1))
        let result4 = `[ *MEDIAFIRE DOWNLOADER* ]

*Name* : ${baby1[0].nama}
*Size* : ${baby1[0].size}
*Type* : ${baby1[0].mime}

_Wait Mengirim file..._
`
        adReply(result4, `${baby1[0].nama}`, ``)
        conn.sendMessage(from, { document: { url: baby1[0].link }, fileName: baby1[0].nama, mimetype: baby1[0].mime }, { quoted: msg }).catch((err) => reply('Gagal saat mendownload File'))
        break
      case 'grupbot':
      case 'groupbot':
        conn.sendMessage(from, { text: `${setting.group.judul}\n${setting.group.link}` }, { quoted: msg })
        break

      case 'setmenu':
        if (isVideo || isQuotedVideo) {
          await conn.downloadAndSaveMediaMessage(msg, 'video', `./sticker/menu.mp4`)
        }
        reply('Done')
        break
      case 'setthumb':
        if (isImage || isQuotedImage) {
          await conn.downloadAndSaveMediaMessage(msg, 'image', `./sticker/thumb.jpg`)
        }
        reply('Done')
        break
      case 'setadreply':
        if (isImage || isQuotedImage) {
          await conn.downloadAndSaveMediaMessage(msg, 'image', `./sticker/adreply.jpg`)
        }
        reply('Done')
        break
      case 'setppbot':
      case 'spb':
        if (isImage && isQuotedImage) return
        await conn.downloadAndSaveMediaMessage(msg, "image", `./sticker/${sender.split('@')[0]}.jpg`)
        var media = `./sticker/${sender.split('@')[0]}.jpg`
        var { img } = await conn.generateProfilePicture(media)
        await conn.query({
          tag: 'iq',
          attrs: {
            to: botNumber,
            type: 'set',
            xmlns: 'w:profile:picture'
          },
          content: [
            {
              tag: 'picture',
              attrs: { type: 'image' },
              content: img
            }
          ]
        })
        await sleep(2000)
        fs.unlinkSync(media)
        break
      case 'setprefix':
        setting.prefix = args[0]
        fs.writeFileSync('./config.json', JSON.stringify(setting, null, 2))
        reply('done')
        break
      case 'mysesi': case 'sendsesi': case 'session': {
        reply('please wait..')
        await sleep(3000)

        // Read Database
        var sesi_bot = fs.readFileSync(`./sessions/creds.json`)

        // Sending Document
        conn.sendMessage(from, { document: sesi_bot, mimetype: 'document/application', fileName: 'session.json' }, { quoted: msg })
      }
        break


      case 'clear':
      case 'clearer':
      case 'clearerr': {
        server_eror.splice('[]')
        fs.writeFileSync('./database/func_error.json', JSON.stringify(server_eror))
        reply('Done')
      }
        break
      case 'error': {
        var teks = `*ERROR SERVER*\n_Error total_ : ${server_eror.length}\n\n`
        var NO = 1
        for (let i of server_eror) {
          teks += `=> *ERROR (${NO++})*\n${i.error}\n\n`
        }
        reply(teks)
      }
        break
      case 'addrespon':
        var args1 = q.split("|")[0]
        var args2 = q.split("|")[1]
        if (!q.includes("|")) return reply(`use ${prefix + command} *key|response*\n\n_example_\n\n#${command} tes|apa`)
        if (isAlreadyResponList(from, args1, db_respon_list)) return reply(`Response key : *${args1}* already added in this group`)
        addResponList(from, args1, args2, false, '-', db_respon_list)
        reply(`Success add key: *${args1}*`)
        break
      case 'delrespon':
        if (db_respon_list.length === 0) return reply(`not found`)
        if (!q) return reply(`use: ${prefix + command} *key*\n\n_example_\n\n${command} hello`)
        if (!isAlreadyResponList(from, q, db_respon_list)) return reply(`List response key: *${q}* not found in database!`)
        delResponList(from, q, db_respon_list)
        reply(`Success delete key: *${q}*`)
        break

      case 'fitnah':
      case 'reply':
        if (!isGroup) return reply(mess.OnlyGrup)
        if (!q) return reply(`example *${prefix + command}* @tag|targetmessage|botmessage`)
        var org = q.split("|")[0]
        var target = q.split("|")[1]
        var bot = q.split("|")[2]
        if (!org.startsWith('@')) return reply('Tag someone')
        if (!target) return reply(`add target message`)
        if (!bot) return reply(`add bot message`)
        var mens = parseMention(target)
        var msg1 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { extemdedTextMessage: { text: `${target}`, contextInfo: { mentionedJid: mens } } } }
        var msg2 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { conversation: `${target}` } }
        conn.sendMessage(from, { text: bot, mentions: mentioned }, { quoted: mens.length > 2 ? msg1 : msg2 })
        break

      case 'setppgrup':
      case 'setppgc':
      case 'spgc':
        if (!isGroup) return reply(mess.OnlyGrup)
        if (!isBotGroupAdmins) return reply(mess.BotAdmin)
        if (isImage && isQuotedImage) return reply(`Kirim gambar dengan caption *#bukti* atau reply gambar yang sudah dikirim dengan caption *#bukti*`)
        await conn.downloadAndSaveMediaMessage(msg, "image", `./sticker/${sender.split('@')[0]}.jpg`)
        var media = `./sticker/${sender.split('@')[0]}.jpg`
        var { img } = await conn.generateProfilePicture(media)
        await conn.query({
          tag: 'iq',
          attrs: {
            to: from,
            type: 'set',
            xmlns: 'w:profile:picture'
          },
          content: [
            {
              tag: 'picture',
              attrs: { type: 'image' },
              content: img
            }
          ]
        })
        await sleep(2000)
        fs.unlinkSync(media)
        break

      case 'tagall':
        if (!q) return reply(`Teks?`)
        let teks_tagall = `══✪〘 *👥 Tag All* 〙✪══\n\n${q ? q : ''}\n\n`
        for (let mem of participants) {
          teks_tagall += `➲ @${mem.id.split('@')[0]}\n`
        }
        conn.sendMessage(from, { text: teks_tagall, mentions: participants.map(a => a.id) }, { quoted: msg })
        break
      case 'hidetag':
      case 'h':
        if (!isGroup) return reply(mess.OnlyGrup)
        let mem = [];
        groupMembers.map(i => mem.push(i.id))
        conn.sendMessage(from, { text: q ? q : '', mentions: mem })
        break

      case 'infogc':
      case 'infogrup':
      case 'infogroup':

        if (!isGroup) return reply(mess.OnlyGrup)
        let cekgcnya = `*INFO GROUP*
• *ID:* ${from}
• *Name:* ${groupName}
• *Member:* ${groupMembers.length}
• *Total Admin:* ${groupAdmins.length}`
        reply(cekgcnya)
        break

      //TOOLS

      case 'tourl': case 'upload':
        if (isVideo || isQuotedVideo) {
          await conn.downloadAndSaveMediaMessage(msg, 'video', `./sticker/${sender.split("@")[0]}.mp4`)
          let buffer_up = fs.readFileSync(`./sticker/${sender.split("@")[0]}.mp4`)
          var rand2 = 'sticker/' + getRandom('.mp4')
          fs.writeFileSync(`./${rand2}`, buffer_up)
          var text = await TelegraPh(rand2)
          reply(text)
          fs.unlinkSync(`./sticker/${sender.split("@")[0]}.mp4`)
          fs.unlinkSync(rand2)
        } else if (isImage || isQuotedImage) {
          var mediany = await conn.downloadAndSaveMediaMessage(msg, 'image', `./sticker/${sender.split("@")[0]}.jpg`)
          let buffer_up = fs.readFileSync(mediany)
          var rand2 = 'sticker/' + getRandom('.png')
          fs.writeFileSync(`./${rand2}`, buffer_up)
          var text = await TelegraPh(rand2)
          reply(text)
          fs.unlinkSync(mediany)
          fs.unlinkSync(rand2)
        }
        break

      case 'readmore':
        var txt1 = q.split('|')[0]
        var txt2 = q.split('|')[1]
        await conn.sendMessage(from, { text: `${txt1}${readmore}${txt2}` })
        break

      case 'ssweb':
        var data = await getBuffer(`https://api.nataganz.com/api/tools/ssweb?link=${q}&apikey=92a0kk2bc9`)
        await conn.sendMessage(from, {
          image: data,
          caption: q,
        },
          { quoted: ftokoo }
        )
        break

      // CONVERT
      case 'toimg': case 'toimage':

        if (isSticker || isQuotedSticker) {
          await conn.downloadAndSaveMediaMessage(msg, "sticker", `./sticker/${sender.split("@")[0]}.webp`)
          let buffer = fs.readFileSync(`./sticker/${sender.split("@")[0]}.webp`)
          var rand1 = 'sticker/' + getRandom('.webp')
          var rand2 = 'sticker/' + getRandom('.png')
          fs.writeFileSync(`./${rand1}`, buffer)
          exec(`ffmpeg -i ./${rand1} ./${rand2}`, (err) => {
            fs.unlinkSync(`./${rand1}`)
            if (err) return reply(mess.error.api)
            conn.sendMessage(from, { caption: `*Sticker Convert To Image!*`, image: fs.readFileSync(`./${rand2}`), jpegThumbnail: fs.readFileSync('./sticker/thumb.jpg') }, { quoted: msg })
            fs.unlinkSync(`./${rand2}`)
            fs.unlinkSync(`./sticker/${sender.split("@")[0]}.webp`)
          })
        } else {
          reply('*Reply sticker nya dengan pesan #toimg*\n\n*Atau bisa sticker gif dengan pesan #tovideo*')
        }
        break
      case 'tomp4': case 'tovideo':

        if (isSticker || isQuotedSticker) {
          await conn.downloadAndSaveMediaMessage(msg, "sticker", `./sticker/${sender.split("@")[0]}.webp`)
          let buffer = `./sticker/${sender.split("@")[0]}.webp`
          let webpToMp4 = await webp2mp4File(buffer)
          conn.sendMessage(from, { video: { url: webpToMp4.result }, caption: 'Convert Webp To Video', jpegThumbnail: fs.readFileSync('./sticker/thumb.jpg') }, { quoted: msg })
          fs.unlinkSync(buffer)
        } else {
          reply('*Reply sticker gif dengan pesan #tovideo*')
        }
        break
      case 'emojimix': case 'mixemoji':
      case 'emojmix': case 'emojinua':

        if (!q) return reply(`Kirim perintah ${command} emoji1+emoji2\nexampl : !${command} 😜+😅`)
        if (!q.includes('+')) return reply(`Format salah, exampl pemakaian !${command} 😅+😭`)
        var emo1 = q.split("+")[0]
        var emo2 = q.split("+")[1]
        if (!isEmoji(emo1) || !isEmoji(emo2)) return reply(`Itu bukan emoji!`)
        fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emo1)}_${encodeURIComponent(emo2)}`)
          .then(data => {
            var opt = { packname: setting.group.judul, author: pushname }
            conn.sendImageAsSticker(from, data.results[0].url, msg, opt)
          }).catch((e) => reply(mess.error.api))
        break

      case 'tomp3': case 'toaudio':
        if (isVideo || isQuotedVideo) {
          await conn.downloadAndSaveMediaMessage(msg, 'video', `./sticker/${sender.split("@")[0]}.mp4`)
          let buffer_up = fs.readFileSync(`./sticker/${sender.split("@")[0]}.mp4`)
          var rand2 = 'sticker/' + getRandom('.mp4')
          fs.writeFileSync(`./${rand2}`, buffer_up)
          exec(`ffmpeg -i ${media} ${rand2}`, (err) => {
            var buffer453 = fs.readFileSync(rand2);
            conn.sendMessage(from, {
              audio: buffer453,
              mimetype: "audio/mp4",
              quoted: msg,
            });
            fs.unlinkSync(rand2);
            fs.unlinkSync(`./sticker/${sender.split("@")[0]}.mp4`)
          })
        }
        break;

      case 'emojimix2': case 'mixemoji2':
      case 'emojmix2': case 'emojinua2': {
        if (!q) return reply(`Example : ${prefix + command} 😅`)
        let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(q)}`)
        for (let res of anu.results) {
          var opt = { packname: setting.group.judul, author: pushname }
          let encmedia = await conn.sendImageAsSticker(from, res.url, msg, opt)
        }
      }
        break
      case 'smeme':
      case 'stikermeme':
      case 'stickermeme':
      case 'memestiker':
      case 'stcmeme':
        anu = q.split("|");
        var tengah = `‎`
        var atas = anu[0] !== "" ? anu[0] : `${tengah}`;
        var bawah = q.split('|')[1]
        if (!q) return reply(`Kirim gambar dengan caption ${prefix + command} text_atas|text_bawah atau balas gambar yang sudah dikirim`)
        if (isImage || isQuotedImage) {
          var media = await conn.downloadAndSaveMediaMessage(msg, 'image', `./sticker/${sender.split('@')[0]}.jpg`)
          var media_url = (await TelegraPh(media))
          var meme_url = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${media_url}`
          var opt = { packname: ``, author: setting.group.judul }
          conn.sendImageAsSticker(from, meme_url, msg, opt)
          fs.unlinkSync(media)
        } else {
          reply(`Kirim gambar dengan caption ${prefix + command} text_atas|text_bawah atau balas gambar yang sudah dikirim`)

        }
        break

      case 'swm':
      case 'stikerwm':
      case 'stickerwm':
      case 'takesticker':
      case 'take':
        var anu = q.split("|");
        var pname = anu[0] !== "" ? anu[0] : ``;
        var athor = q.split('|')[1]
        if (isSticker || isQuotedSticker) {
          await conn.downloadAndSaveMediaMessage(msg, "sticker", `./sticker/${sender.split("@")[0]}.webp`)
          var media = fs.readFileSync(`./sticker/${sender.split("@")[0]}.webp`)
          let stc = new Sticker(media, {
            pack: `${pname}`, // The pack name
            author: `${athor}`, // The author name
            type: StickerTypes.FULL, // The sticker type
            categories: ['🤩', '🎉'], // The sticker category
            id: '12345', // The sticker id
            quality: 50, // The quality of the output file
            background: 'transparent' // The sticker background color (only for full stickers)
          })
          var buffer = await stc.toBuffer()
          conn.sendMessage(from, { sticker: buffer, fileLength: 1000000000000 }, { quoted: msg })
          fs.unlinkSync(`./sticker/${sender.split("@")[0]}.webp`)
        } else {
          reply(`reply dengan caption ${prefix + command} packname|author atau balas video/foto yang sudah dikirim`)
        }
        break
      case 'sticker': case 's': case 'stiker':

        if (isImage || isQuotedImage) {
          await conn.downloadAndSaveMediaMessage(msg, "image", `./sticker/${sender.split("@")[0]}.jpeg`)
          let stci = fs.readFileSync(`./sticker/${sender.split("@")[0]}.jpeg`)
          let stc = new Sticker(stci, {
            pack: '', // The pack name
            author: setting.group.judul, // The author name
            type: StickerTypes.FULL, // The sticker type
            categories: ['🤩', '🎉'], // The sticker category
            id: '12345', // The sticker id
            quality: 75, // The quality of the output file
            background: 'transparent' // The sticker background color (only for full stickers)
          })
          var buffer = await stc.toBuffer()
          conn.sendMessage(from, { sticker: buffer, fileLength: 99999999 }, { quoted: msg })
          fs.unlinkSync(`./sticker/${sender.split("@")[0]}.jpeg`)
        } else if (isVideo && msg.message.videoMessage.seconds < 10 || isQuotedVideo && quotedMsg.videoMessage.seconds < 10) {
          await conn.downloadAndSaveMediaMessage(msg, "video", `./sticker/${sender.split("@")[0]}.mp4`)
          let stcg = fs.readFileSync(`./sticker/${sender.split("@")[0]}.mp4`)
          let sticker = new Sticker(stcg, {
            pack: '', // The pack name
            author: setting.group.judul, // The author name
            type: StickerTypes.FULL, // The sticker type
            categories: ['🤩', '🎉'], // The sticker category
            id: '12345', // The sticker id
            quality: 20, // The quality of the output file
            background: 'transparent' // The sticker background color (only for full stickers)
          })
          const stikk = await sticker.toBuffer()
          conn.sendMessage(from, { sticker: stikk }, { quoted: msg })
          fs.unlinkSync(`./sticker/${sender.split("@")[0]}.mp4`)
        }
        break
      case 'stickercrop': case 'scrop': case 'stikercrop':

        if (isImage || isQuotedImage) {
          await conn.downloadAndSaveMediaMessage(msg, "image", `./sticker/${sender.split("@")[0]}.jpeg`)
          let stci = fs.readFileSync(`./sticker/${sender.split("@")[0]}.jpeg`)
          let stc = new Sticker(stci, {
            pack: '', // The pack name
            author: setting.group.judul, // The author name
            type: StickerTypes.CROPPED, // The sticker type
            categories: ['🤩', '🎉'], // The sticker category
            id: '12345', // The sticker id
            quality: 75, // The quality of the output file
            background: 'transparent' // The sticker background color (only for full stickers)
          })
          var buffer = await stc.toBuffer()
          conn.sendMessage(from, { sticker: buffer, fileLength: 99999999 }, { quoted: msg })
          fs.unlinkSync(`./sticker/${sender.split("@")[0]}.jpeg`)
        } else if (isVideo && msg.message.videoMessage.seconds < 10 || isQuotedVideo && quotedMsg.videoMessage.seconds < 10) {
          await conn.downloadAndSaveMediaMessage(msg, "video", `./sticker/${sender.split("@")[0]}.mp4`)
          let stcg = fs.readFileSync(`./sticker/${sender.split("@")[0]}.mp4`)
          let sticker = new Sticker(stcg, {
            pack: '', // The pack name
            author: setting.group.judul, // The author name
            type: StickerTypes.CROPPED, // The sticker type
            categories: ['🤩', '🎉'], // The sticker category
            id: '12345', // The sticker id
            quality: 20, // The quality of the output file
            background: 'transparent' // The sticker background color (only for full stickers)
          })
          const stikk = await sticker.toBuffer()
          conn.sendMessage(from, { sticker: stikk }, { quoted: msg })
          fs.unlinkSync(`./sticker/${sender.split("@")[0]}.mp4`)
        }
        break

      // ANIMANGA
      case 'ppcouple': case 'ppcp': {
        let anu = await fetchJson('https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json')
        let random = anu[Math.floor(Math.random() * anu.length)]
        conn.sendMessage(from, { image: { url: random.male }, caption: `Foto Couple Male` }, { quoted: msg })
        conn.sendMessage(from, { image: { url: random.female }, caption: `Fofo Couple Female` }, { quoted: msg })
      }
        break

      case 'genshin':
        const gsn = JSON.parse(fs.readFileSync('./database/genshin.json'))
        var data = gsn[Math.floor(Math.random() * gsn.length)]
        var hasil = await getBuffer(data)
        await conn.sendMessage(from, { image: hasil, jpegThumbnail: fs.readFileSync('./sticker/thumb.jpg'), fileLength: 999999999 })
        break
      case 'addgenshin':
      case 'addgsn':
        if (isImage || isQuotedImage) {
          const genshin = JSON.parse(fs.readFileSync('./database/genshin.json'));
          var mediany = await conn.downloadAndSaveMediaMessage(msg, 'image', `./sticker/${sender.split("@")[0]}.jpg`)
          let buffer_up = fs.readFileSync(mediany)
          var rand2 = 'sticker/' + getRandom('.png')
          fs.writeFileSync(`./${rand2}`, buffer_up)
          var text = await TelegraPh(rand2)
          genshin.push(text)
          fs.writeFileSync('./database/genshin.json', JSON.stringify(genshin, null, 2))
          adReply('*Done add picture to database!*', 'Genshin Impact', `Total Picture: ${genshin.length}`)
          fs.unlinkSync(mediany)
          fs.unlinkSync(rand2)
        }
        break

      case 'otakudesu':
        if (args[0].includes("latest") || args[0].includes("Latest")) {
          await fetchJson("https://weebs-nime.kimiakomtol.repl.co/otakudesu/ongoing/page/1").then(async (res) => {
            var teks = `Otakudesu Ongoing\n\n`
            for (let g of res.ongoing) {
              teks += `• *Title* : ${g.title}\n`
              teks += `• *Total Episode* : ${g.total_episode}\n`
              teks += `• *Link* : ${g.url}\n\n────────────────────────\n\n`
            }
            reply(teks)
          })
        } else if (args[0].includes("detail")) {
          if (!args[1]) return reply(`exampl:\n${prefix + command} https://otakudesu.lol/anime/tegoku-daimau-sub-indo/`)
          await fetchJson(`https://weebs-nime.kimiakomtol.repl.co/otakudesu/detail?url=${args[1]}`).then(async (res) => {
            var teks = `${res.anime_detail.title}\n\n`
            for (let g of res.episode_list) {
              teks += `• *Title:* ${g.episode_title}\n`
              teks += `• *Date:* ${g.episode_date}\n`
              teks += `• *Link:* ${g.episode_url}\n────────────────────────\n\n`
            }
            reply(teks)
          })
        }
        break


      case 'jadibot': case 'newsession': case 'addsession': {
        jadibot(conn, msg, from)
      }
        break
      case 'listjadibot': case 'listsession':
        try {
          let user = [... new Set([...global.conns.filter(conn => conn.user).map(conn => conn.user)])]
          te = "*List Jadibot*\n\n"
          for (let i of user) {
            let y = await conn.decodeJid(i.id)
            te += " × User : @" + y.split("@")[0] + "\n"
            te += " × Name : " + i.name + "\n\n"
          }
          conn.sendMessage(from, { text: te, mentions: [y], }, { quoted: msg })
        } catch (err) {
          reply(`Belum Ada User Yang Jadibot`)
        }
        break

      default:

    }
  } catch (err) {
    console.log(color('[ERROR]', 'red'), err)
    server_eror.push({ "error": `${err}` })
    fs.writeFileSync('./database/func_error.json', JSON.stringify(server_eror))
  }
}