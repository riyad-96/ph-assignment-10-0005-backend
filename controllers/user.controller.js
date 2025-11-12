// Local modules
const { getDB } = require('../db/establishConnection');

async function getUserData(req, res) {
  const email = res.locals.userInfo?.email;

  if (!email) return res.status(401).send({ message: 'unique-identifier-required' });

  try {
    const db = getDB();
    const collection = db.collection('users');
    const partnerProfile = await collection.findOne({ email });

    if (partnerProfile) {
      res.send(partnerProfile);
    } else {
      res.status(404).send({ message: 'user-not-found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'server-error' });
  }
}

async function createUserProfile(req, res) {
  const newPartnerProfileData = req.body;
  const { email } = res.locals.userInfo;

  try {
    const db = getDB();
    const collection = db.collection('users');

    const exists = await collection.findOne({ email });
    if (exists) {
      res.status(409).send({ message: 'profile-already-exists' });
      return;
    }
    const newDate = new Date().toISOString();
    const inserted = await collection.insertOne({ ...newPartnerProfileData, email, createdAt: newDate, updatedAt: newDate });
    if (inserted) {
      const createdProfileData = await collection.findOne({ _id: inserted.insertedId });
      res.send({ message: 'profile-created', userProfile: createdProfileData });
    } else {
      res.status(404).send({ message: 'profile-creation-failed' });
    }
  } catch (err) {
    res.status(500).send({ message: 'profile-creation-failed' });
  }
}

async function updateUserProfileData(req, res) {
  const email = res.locals.userInfo.email;

  try {
    const usersCollection = getDB().collection('users');

    // if user not exists then create
    const userExists = await usersCollection.findOne({ email });
    if (!userExists) {
      await usersCollection.insertOne({
        name: req.body.name,
        email,
        profileImage: req.body.profileImage,
        subject: '',
        studyMode: 'Online',
        availabilityTime: 'Early Morning (5-8 AM)',
        location: '',
        experienceLevel: 'Beginner',
        rating: 0,
        partnerCount: 0,
      });
      const newlyCreatedUserProfile = await usersCollection.findOne({ email });
      res.send({ message: 'profile-updated', userProfile: newlyCreatedUserProfile, code: 'created' });
      return;
    }

    const updatedInfo = await usersCollection.findOneAndUpdate(
      { email },
      {
        $set: { ...req.body, updatedAt: new Date().toISOString() },
      },
      {
        returnDocument: 'after',
      }
    );
    res.send({ message: 'profile-updated', userProfile: updatedInfo });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'server-error' });
  }
}

module.exports = { getUserData, createUserProfile, updateUserProfileData };
