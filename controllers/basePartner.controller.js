// Local modules
const { getDB } = require('../db/establishConnection');

async function getAllPartnerProfiles(req, res) {
  try {
    const db = getDB();
    const collection = db.collection('basepartners');
    const partners = await collection.find().toArray();
    res.send(partners);
  } catch (err) {
    res.status(500).send({ message: 'server-error' });
  }
}

async function getPartnerProfileBasedOnQuery(req, res) {
  const search = req.query.search;
  const regex = new RegExp(search, 'i');

  try {
    const allDocs = await getDB()
      .collection('basepartners')
      .find({
        $or: [{ subject: regex }, { studyMode: regex }, { name: regex }, { experienceLevel: regex }],
      })
      .toArray();

    res.send(allDocs);
  } catch (err) {
    res.status(500).send({ message: 'server-error' });
  }
}

module.exports = { getAllPartnerProfiles, getPartnerProfileBasedOnQuery };
