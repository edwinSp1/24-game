var cmd = "SET DEBUG=express-locallibrary-tutorial:* & npm start"
const app = require("./express-locallibrary-tutorial/app");
var uri = "mongodb+srv://admin:bedumble3@cluster0.dcug42s.mongodb.net/?retryWrites=true&w=majority"
const game24 = require('./express-locallibrary-tutorial/modules/24.js')
const {MongoClient} = require('mongodb')
const client = new MongoClient(uri)
async function getDB (db, coll, query) {
  try {
    await client.connect()
    var collection = client.db(db).collection(coll)
    var cursor = await collection.find(query)
    var res = []
    for await(var doc of cursor) res.push(doc)
    return res
  } catch (e) {
    return e
  } finally {
    await client.close()
  }
}

async function insertDB(db, coll, docs) {
  try {
    await client.connect()
    var collection = client.db(db).collection(coll)
    var res = await collection.insertMany(docs)
    return res
  } catch(e) {
    return e
  } finally {
    await client.close()
  }
}
