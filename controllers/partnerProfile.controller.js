// Local modules
const { getDB } = require('../db/establishConnection');

async function getPartnerProfileData(req, res) {
  const email = res.locals.userInfo?.email;

  if (!email) return res.status(401).send({ message: 'unique-identifier-required' });

  try {
    const db = getDB();
    const collection = db.collection('partner-profiles');
    const partnerProfile = await collection.findOne({ email });

    if (partnerProfile) {
      res.send(partnerProfile);
    } else {
      res.status(404).send({ message: 'profile-not-found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'server-error' });
  }
}

async function createPartnerProfile(req, res) {
  const newPartnerProfileData = req.body;
  const { email } = res.locals.userInfo;

  try {
    const db = getDB();
    const collection = db.collection('partner-profiles');

    const exists = await collection.findOne({ email });
    if (exists) {
      res.status(409).send({ message: 'profile-already-exists' });
      return;
    }
    const newDate = new Date().toISOString();
    const inserted = await collection.insertOne({ ...newPartnerProfileData, email, createdAt: newDate, updatedAt: newDate });
    if (inserted) {
      const createdProfileData = await collection.findOne({ _id: inserted.insertedId });
      res.send(createdProfileData);
    } else {
      res.status(404).send({ message: 'profile-creation-failed' });
    }
  } catch (err) {
    res.status(500).send({ message: 'profile-creation-failed' });
  }
}

async function updatePartnerProfileData(req, res) {
  const { email } = res.locals.userInfo;

  try {
    const db = getDB();
    const collection = db.collection('partner-profiles');
    const updateInfo = await collection.findOneAndUpdate(
      { email },
      {
        $set: { ...req.body, updatedAt: new Date().toISOString() },
      },
      {
        returnDocument: 'after',
      }
    );
    res.send(updateInfo);
  } catch (err) {
    res.status(500).send({ message: 'server-error' });
  }
}

module.exports = { getPartnerProfileData, createPartnerProfile, updatePartnerProfileData };
