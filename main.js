"use strict";
const { default: makeWASocket, MessageType, DisconnectReason, useMultiFileAuthState, makeInMemoryStore, downloadContentFromMessage, jidDecode, generateForwardMessageContent, generateWAMessageFromContent, makeCacheableSignalKeyStore } = require("@adiwajshing/baileys")
const fs = require("fs");
const figlet = require("figlet");
const lolcatjs = require('lolcatjs');
const chalk = require('chalk')
const logg = require('pino')
const Jimp = require('jimp')
const parsePhoneNumber = require('libphonenumber-js')
const readline = require('readline');
const { nocache, uncache } = require('./function/Chache_Data.js');
const { serialize, fetchJson, getBuffer } = require("./function/func_Server");
const { status_Connection } = require('./function/Data_Server_Bot/Status_Connect.js')
const { Memory_Store } = require('./function/Data_Server_Bot/Memory_Store.js')
const { color } = require('./function/Data_Server_Bot/Console_Data')

let setting = JSON.parse(fs.readFileSync('./config.json'));
const botLogger = logg({ level: 'silent' })

function title() {
	console.clear()
	console.log('----------------------------------------------------')
	lolcatjs.fromString(chalk.cyan(figlet.textSync('Rafly', {
		font: 'Bloody',
		horizontalLayout: 'full',
		verticalLayout: 'full',
		whitespaceBreak: true
	})));
	console.log('----------------------------------------------------')
	lolcatjs.fromString('[SERVER STARTED!!!]')
	console.log('----------------------------------------------------')
	lolcatjs.fromString('Create by Rafly¹¹')
	console.log('----------------------------------------------------')
}

async function sedative() {
	const { state, saveCreds } = await useMultiFileAuthState('./sessions')

	const useStore = !process.argv.includes('--no-store')
	const doReplies = !process.argv.includes('--no-reply')
	const usePairingCode = !process.argv.includes('--use-pairing-code')
	const useMobile = process.argv.includes('--mobile')

	async function connectToWhatsApp() {

		const conn = makeWASocket({
			printQRInTerminal: !usePairingCode,
			markOnlineOnConnect: false,
			logger: botLogger,
			browser: ['Mac OS', 'safari', '5.1.10'],
			auth: state,
			mobile: useMobile,
			generateHighQualityLinkPreview: true,
			patchMessageBeforeSending: (message) => {
				return message;
			}
		})
		title()
		Memory_Store.bind(conn.ev)

		var question = function (text) {
			return new Promise(function (resolve) {
				rl.question(text, resolve);
			});
		};

		const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

		if (usePairingCode && !conn.authState.creds.registered) {
			const phoneNumber = await question('Please enter your mobile phone number:\n')
			const code = await conn.requestPairingCode(phoneNumber)
			console.log(`Pairing code: ${code}`)

		}
		// New Login Update via Mobile Number
		if (useMobile && !conn.authState.creds.registered) {
			// const question = (text) => new Promise<string>((resolve) => rl.question(text, resolve))
			var question = function (text) {
				return new Promise(function (resolve) {
					rl.question(text, resolve);
				});
			};
			const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
			const { registration } = conn.authState.creds || { registration: {} }

			if (!registration.phoneNumber) {
				registration.phoneNumber = await question('Please enter your mobile phone number:  ')
			}

			const phoneNumber = parsePhoneNumber(registration?.phoneNumber)
			if (!phoneNumber?.isValid()) {
				console.log('Invalid phone number: ' + registration?.phoneNumber)
				process.exit(1)
			}

			registration.phoneNumber = phoneNumber.format('E.164')
			registration.phoneNumberCountryCode = phoneNumber.countryCallingCode
			registration.phoneNumberNationalNumber = phoneNumber.nationalNumber
			const mcc = phoneNumber[phoneNumber.countryCallingCode]
			if (!mcc) {
				throw new Error('Could not find MCC for phone number: ' + registration?.phoneNumber + '\nPlease specify the MCC manually.')
			}

			registration.phoneNumberMobileCountryCode = mcc

			async function enterCode() {
				try {
					const code = await question('Please enter the one time code: ')
					const response = await conn.register(code.replace(/["']/g, '').trim().toLowerCase())
					console.log('Successfully registered your phone number.')
					console.log(response)
					rl.close()
				} catch (error) {
					console.error('Failed to register your phone number. Please try again.\n', error)
					await askForOTP()
				}
			}

			async function askForOTP() {
				let code = await question('How would you like to receive the one time code for registration? "sms" or "voice" ')
				code = code.replace(/["']/g, '').trim().toLowerCase()

				if (code !== 'sms' && code !== 'voice') {
					return await askForOTP()
				}

				registration.method = code

				try {
					await conn.requestRegistrationCode(registration)
					await enterCode()
				} catch (error) {
					console.error('Failed to request registration code. Please try again.\n', error)
					await askForOTP()
				}
			}

			askForOTP()
		}


		conn.ev.on('messages.upsert', async m => {
			var msg = m.messages[0]
			if (!m.messages) return;
			if (msg.key && msg.key.remoteJid == "status@broadcast") return
			msg = serialize(conn, msg)
			msg.isBaileys = msg.key.id.startsWith('BAE5') || msg.key.id.startsWith('3EB0')
			require('./conn')(conn, msg, m, setting, Memory_Store)
		})

		conn.ev.on('creds.update', saveCreds)

		conn.reply = (from, content, msg) => conn.sendMessage(from, { text: content }, { quoted: msg })


		conn.ev.on('connection.update', async (update, anu) => {
			status_Connection(conn, update, connectToWhatsApp)
		})

		conn.ev.on('group-participants.update', (update) => {
			if (update.action == 'remove') {
				var txt = "\n" + color('───────────────> PARTICIPANTS REMOVE', 'red') + "\n"
				txt += color(`• Id		: ` + update.id, 'red') + "\n"
				txt += color(`• Participants	: ` + update.participants, 'red') + "\n"
				txt += color('─────────────────────────────────────>', 'red') + "\n"
				console.log(txt)
			} else if (update.action == 'add') {
				var txt = "\n" + color('──────────────────> PARTICIPANTS ADD', 'green') + "\n"
				txt += color(`• Id		: ` + update.id) + "\n"
				txt += color(`• Participants	: ` + update.participants) + "\n"
				txt += color('─────────────────────────────────────>', 'green') + "\n"
				console.log(txt)
			}
		})

		conn.sendImage = async (jid, path, caption = '', quoted = '', options) => {
			let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
			return await conn.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
		}

		conn.decodeJid = (jid) => {
			if (!jid) return jid
			if (/:\d+@/gi.test(jid)) {
				let decode = jidDecode(jid) || {}
				return decode.user && decode.server && decode.user + '@' + decode.server || jid
			} else return jid
		}

		conn.generateProfilePicture = async (buffer) => {

			const jimp = await Jimp.read(buffer)
			const min = jimp.getWidth()
			const max = jimp.getHeight()
			const cropped = jimp.crop(0, 0, min, max)
			return {
				img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
				preview: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG)
			}
		}
		conn.downloadAndSaveMediaMessage = async (msg, type_file, path_file) => {
			if (type_file === 'image') {
				var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
				let buffer = Buffer.from([])
				for await (const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'video') {
				var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
				let buffer = Buffer.from([])
				for await (const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'sticker') {
				var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
				let buffer = Buffer.from([])
				for await (const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'audio') {
				var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
				let buffer = Buffer.from([])
				for await (const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			}
		}

		return conn
	}
	connectToWhatsApp()
}
sedative()
