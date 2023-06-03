
const fs = require('fs')

exports.groupResponse_Remove = async (conn, update) => {
try {
ppuser = await conn.profilePictureUrl(num, 'image')
} catch {
ppuser = 'https://telegra.ph/file/265c672094dfa87caea19.jpg'
}
const metadata = await conn.groupMetadata(update.id)
for (let participant of update.participants) {
try{
let metadata = await conn.groupMetadata(update.id)
let participants = update.participants
for (let num of participants) {
if (update.action == 'remove'){
await conn.sendMessage(
update.id, 
{
text: `*Sayonara @${num.split("@")[0]}*\n*Semoga tenang di alam sana*\n*Latom*`,
mentions: [num] })
}
}
} catch (err) {
console.log(err)
}
}   
}
  
exports.groupResponse_Welcome = async (conn, update) => {
try {
ppuser = await conn.profilePictureUrl(num, 'image')
} catch {
ppuser = 'https://telegra.ph/file/265c672094dfa87caea19.jpg'
}
const metadata = await conn.groupMetadata(update.id)   
for (let participant of update.participants) {
try{
let metadata = await conn.groupMetadata(update.id)
let participants = update.participants
for (let num of participants) {
if (update.action == 'add') {
await conn.sendMessage(
update.id, 
{ 
image: { url: 'https://telegra.ph/file/fd74e1b40ca279c0b0afe.jpg' },
caption: `*Hello @${num.split("@")[0]}*\n*Welcome to ${metadata.subject}*\n*Jangan Lupa Baca Deskripsi Ya*`,
mentions: [num] })
}
}
} catch (err) {
console.log(err)
}
}   
}
  
exports.groupResponse_Promote = async (conn, update) => {  
const metadata = await conn.groupMetadata(update.id)   
for (let participant of update.participants) {
try{
let metadata = await conn.groupMetadata(update.id)
let participants = update.participants
for (let num of participants) {
if (update.action == 'promote') {
await conn.sendMessage(
update.id, 
{ 
image: {url: 'https://telegra.ph/file/0d7a5df57b85bafbcc12f.jpg'},
caption: `*@${num.split("@")[0]} Naik jabatan jadi admin grup*`,
mentions: [num] })
}
}
} catch (err) {
console.log(err)
}
}   
}
 

exports.groupResponse_Demote = async (conn, update) => {  
    const metadata = await conn.groupMetadata(update.id)   
    for (let participant of update.participants) {
    try{
    let metadata = await conn.groupMetadata(update.id)
    let participants = update.participants
    for (let num of participants) {
    if (update.action == 'demote') {
    }
    }
    } catch (err) {
    console.log(err)
    }
    }   
    }