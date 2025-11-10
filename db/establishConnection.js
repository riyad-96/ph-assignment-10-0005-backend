// External modules
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

let db = null;

async function establishDBConnection(callback) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('mongodb connected');
    db = client.db(dbName);

    callback(null);
  } catch (err) {
    callback(err);
  }
}

/** @returns {import('mongodb').Db} */
function getDB() {
  if (!db) throw new Error('Database not found');
  return db;
}

module.exports = { establishDBConnection, getDB };
