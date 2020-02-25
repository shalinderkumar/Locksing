var express = require('express');
var router = express.Router();

/* WELCOME URL */

router.get('/', function (req, res) {
  res.render('index');
})

/* GET WebApp page. */

router.get('/LockSign', function (req, res) {
  res.render('webApp/index');
})

/* GET sign in page. */
router.get('/webApp/sign-in', function (req, res) {
  res.render('webApp/login');
})

/* GET sign up page. */
router.get('/webApp/sign-up', function (req, res) {
  res.render('webApp/signUp');
})


/* POST sign in api. */
router.post('/webApp/signIn', function (req, res) {
  console.log(req.body)
})

module.exports = router;
