import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  try {
    // console.log(`in auth : ${req.headers}`);
    const token = req.headers.authorization.split(' ')[1];
    const isCustomAuth = token.length < 500; //if token length more than 500 then this is oath token
    let decodedData;
    // console.log(`in auth : ${token} ${token.length}`);
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.SECRET_JWT_STRING);
      // console.log(`in auth : ${JSON.stringify(decodedData)} ${token.length}`);
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
