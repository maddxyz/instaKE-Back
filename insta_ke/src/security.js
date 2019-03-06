var jwt = require('jsonwebtoken');

const SECRET_KEY = "malzahar knows the truth";

function verify_token(token) {
    try {
        jwt.verify(token, SECRET_KEY);
        return true;
    } catch(err) {
        return false;
    }
}

function get_username(token) {
    try {
        let decoded = jwt.verify(token, SECRET_KEY);

        return decoded.username;
    } catch(err) {
        return null;
    }
}

module.exports =  {verify_token, get_username};
