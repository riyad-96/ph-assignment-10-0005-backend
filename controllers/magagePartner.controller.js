// Local modules
const { ObjectId } = require('mongodb');
const { getDB } = require('../db/establishConnection');

async function sendPartnerRequest(req, res) {
  try {
    const email = res.locals.userInfo.email;
    const { toId, name, profileImage } = req.body;

    // check if request already exists
    const requestsCollection = getDB().collection('partner-requests');
    const previousRequest = await requestsCollection.findOne({ requestBy: email, originalId: toId });
    if (previousRequest) {
      return res.status(409).send({ message: 'request-already-exists' });
    }

    // increase partner count by 1
    const basepartnersColl = getDB().collection('basepartners');
    const partnerProfile = await basepartnersColl.findOneAndUpdate({ _id: new ObjectId(toId) }, { $inc: { partnerCount: 1 } }, { returnDocument: 'after' });

    // create new doc in different collection with updated partner profile
    const { _id, ...rest } = partnerProfile;
    await requestsCollection.insertOne({
      ...rest,
      originalId: _id,
      requestBy: email,
    });

    // check if user exists. if not then create and update
    const usersCollection = getDB().collection('users');
    const userExists = await usersCollection.findOne({ email });
    if (!userExists) {
      const newDate = new Date().toISOString();
      await usersCollection.insertOne({
        name,
        email,
        profileImage,
        subject: '',
        studyMode: 'Online',
        availabilityTime: 'Early Morning (5-8 AM)',
        location: '',
        experienceLevel: 'Beginner',
        rating: 0,
        partnerCount: 0,
        createdAt: newDate,
        updatedAt: newDate,
      });
      const newlyCreatedUser = await usersCollection.findOneAndUpdate({ email }, { $inc: { partnerCount: 1 } }, { returnDocument: 'after' });
      res.send({ message: 'partner-request-sent', userProfile: newlyCreatedUser, code: 'created' });
      return;
    }

    const updatedUserProfile = await usersCollection.findOneAndUpdate({ email }, { $inc: { partnerCount: 1 } }, { returnDocument: 'after' });
    res.send({ message: 'partner-request-sent', userProfile: updatedUserProfile });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'server-error' });
  }
}

async function checkPartnerRequest(req, res) {
  try {
    const email = res.locals.userInfo.email;
    const partnerId = req.body.partnerId;
    const requestsCollection = getDB().collection('partner-requests');
    const exists = await requestsCollection.findOne({ requestBy: email, originalId: new ObjectId(partnerId) });
    if (exists) {
      res.send({ message: 'request-already-exists' });
    } else {
      res.send({ message: 'request-not-found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'server-error' });
  }
}

async function allRequests(req, res) {
  try {
    const email = res.locals.userInfo.email;
    const requestsCollection = getDB().collection('partner-requests');
    const allRequests = await requestsCollection.find({ requestBy: email }).toArray();
    res.send(allRequests);
  } catch (err) {
    res.status(400).send({ message: 'server-error' });
  }
}

async function removeConnection(req, res) {
  try {
    const email = res.locals.userInfo.email;
    const { originalId, _id } = req.body;
    const basepartnersCollection = getDB().collection('basepartners');
    const requestsCollection = getDB().collection('partner-requests');

    await basepartnersCollection.findOneAndUpdate({ _id: new ObjectId(originalId) }, { $inc: { partnerCount: -1 } });
    await requestsCollection.deleteOne({ _id: new ObjectId(_id), requestBy: email });
    await getDB()
      .collection('users')
      .findOneAndUpdate({ email }, { $inc: { partnerCount: -1 } });
    res.send({ message: 'connection-removed' });
  } catch (err) {
    res.status(500).send({ message: 'server-error' });
  }
}

async function updatePartnerProfile(req, res) {
  try {
    const requestBy = res.locals.userInfo.email;

    const { info, _id } = req.body;
    const requestsCollection = getDB().collection('partner-requests');
    const updatedProfileInfo = await requestsCollection.findOneAndUpdate({ _id: new ObjectId(_id), requestBy }, { $set: info }, { returnDocument: 'after' });
    res.send(updatedProfileInfo);
  } catch (err) {
    res.status(500).send({ message: 'server-error' });
  }
}

module.exports = { sendPartnerRequest, checkPartnerRequest, allRequests, removeConnection, updatePartnerProfile };
