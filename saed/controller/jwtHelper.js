const jwt = require('jsonwebtoken');

module.exports.verifyJwtToken = (req, res, next) => {
    var token;
    if ('authorization' in req.headers) {
        token = req.headers['authorization'].split(' ')[1];
    }

    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    else {
        jwt.verify(token, process.env.JWT_SECRET,
            (err, decoded) => {
                if (err){
                    return res.status(500).send({ auth: false, message: 'Token authentication failed.' });
                } else {
                    req._id = decoded._id;
                    next();
                }
            }
        )
    }
}

module.exports.verifyJwtTokenHome = (req, res, next) => {
  var token;
  token = req.headers['authorization'].split(' ')[1];
  console.log(token);
  //console.log(token.length);
  if(token !== "null") {
      console.log('Eccomi')
      jwt.verify(token, process.env.JWT_SECRET,
          (err, decoded) => {
              if (err){
                  console.log('RiEccomi')
                  return res.status(500).send({ auth: false, message: 'Token authentication failed.' });
              } else {
                  req._id = decoded._id;
                  next();
              }
          }
      )
  } else {
    req._id = null;
    next();
  }
}
