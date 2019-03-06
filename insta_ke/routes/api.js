var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

const security = require('../src/security');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const SECRET_KEY = "malzahar knows the truth";

require('../src/passport');

var models = require("../src/models");

router.use(function (err, req, res, next) {
    if (err) {
        console.log('Error', err);
    } else {
        console.log('404')
    }
});


/* ================= Authentification routes ===================== */
router.post('/auth', function (req, res, next) {
    models.User.findOne({user: req.body.user.username}, function(err, user) {
       if(user) {
           bcrypt.compare(req.body.user.password, user.passwd, function(err, equals) {
               if(equals)
                   return res.json({success: true, token: jwt.sign({username: req.body.user.username, createdAt: Date.now()},
                           SECRET_KEY, { expiresIn: '9h' })});
               else
                   return res.json({success: false});
           });
       }
       else
           return res.json({success: false});
    });

});

router.post('/check_token', function(req, res, next) {
    console.log(req.body.token);

    return res.json({valid: check_token(req.body.token)});
});

router.post('/register', function(req, res, next) {
    console.log(req.body.user);
    console.log(req.body.user.password);



    bcrypt.hash(req.body.user.password, saltRounds, function(err, hash) {
        let newUser = new models.User({
            user: req.body.user.username,
            passwd: hash,
            email: req.body.user.email,
            admin: false
        });

        newUser.save(
            function (err, small) {
                if (err) {
                    console.log("error dude");
                    return handleError(err);
                }
                console.log("saved");
            });

        res.json({ msg: "ok"});
    });
});

router.post('/check_username', function(req, res, next) {
    models.User.count({user: req.body.user.username}, function(err, count) {
        return res.json({available: count === 0});
    })
});

/* ================= Pictures routes ===================== */

router.post('/post_pic', function(req, res, next) {
    console.log(req.token);
    console.log(security.verify_token(req.token));

    console.log(security.get_username(req.token));

    if(!security.verify_token(req.token))
        return res.json({success: false});
    else {
        models.User.findOne({user: security.get_username(req.token)}, function(err, user) {
            if(user) {
                let newPic = new models.Image({
                    user: user,
                    description: req.body.caption,
                    img: req.body.img,
                    addDate: new Date()
                });

                newPic.save(
                    function (err, small) {
                        if (err) {
                            console.log("error dude");
                            return handleError(err);
                        }
                        console.log("saved !");
                        return res.json({success: true});
                    });
            }
            else
                return res.json({success: false});
        });
    }

});

router.get('/wall', function(req, res, next) {
    if(!security.verify_token(req.token))
        return res.json([{}]);
    else {
        models.Image.find({}, {"img": 1, "description": 1}, function(err, images) {
            return res.json(images);
        });
    }

});

router.get('/profil', function(req, res, next) {
    if(!security.verify_token(req.token))
        return res.json([{}]);
    else {
        models.User.findOne({user: security.get_username(req.token)}, function(err, userName) {
            if(userName) {
                models.Image.find({user: userName}, {"img": 1, "description": 1}, function(err, images) {
                    return res.json(images);
                });
            }
            else
                return res.json({success: false});
        });
    }

});

module.exports = router;
