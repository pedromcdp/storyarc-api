const admin = require('../config/firebaseConfig');

const authCheck = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({
      error: {
        code: 'forbidden',
        message: 'The request is missing a valid authorization token.',
        missingToken: true,
      },
    });
  }
};

module.exports = authCheck;
