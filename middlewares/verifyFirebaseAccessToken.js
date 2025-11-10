// Local modules
const { admin } = require('../utils/firebaseAdmin');

async function verifyFirebaseAccessToken(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(403).send({ message: 'unauthorized-access' });

  const [_, token] = authorization.split(' ');
  if (!token) return res.status(403).send({ message: 'unauthorized-access' });

  // verify token
  try {
    const userInfo = await admin.auth().verifyIdToken(token);
    res.locals.userInfo = userInfo;
    next();
  } catch (err) {
    res.status(403).send({ message: 'unauthorized-access' });
  }
}

module.exports = verifyFirebaseAccessToken;
