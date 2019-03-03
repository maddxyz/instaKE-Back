var express = require('express');
var router = express.Router();

var User = require("../src/models");

router.use(function (err, req, res, next) {
    if (err) {
        console.log('Error', err);
    } else {
        console.log('404')
    }
});


/* ================= Authentification routes ===================== */
router.get('/auth', function(req, res, next) {
  //TODO
});

router.get('/check_token', function(req, res, next) {
    //DECOY
    res.json({ valid: true });
});

router.post('/register', function(req, res, next) {
    console.log(req.body.user);
    console.log(req.body.user.password);

    var newUser = new User({
        user: req.body.user.username,
        passwd: req.body.user.password,
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

router.post('/check_username', function(req, res, next) {
    User.count({user: req.body.user.username}, function(err, count) {
        console.log(count);
        console.log(req.body.user.username);
        return res.json({available: count === 0});
    })
});
module.exports = router;
