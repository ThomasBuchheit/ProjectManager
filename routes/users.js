/********************************************************/
// Package Imports
var router = require('express').Router();

// Util Imports
var hash = require('../util/functions/hash');

// Model Imports
var User = require('../models/user');
/********************************************************/


/* GET users listing. */
router.get('/', async function(req, res, next) {

    try {
      var users = await User.get();
    } catch (err) {
      return next(err);
    }

    res.render('index', { title: 'Users', results: users });
});


/* Store new User */
router.post('/', async function (req, res, next) {
  const user = req.body;

  try {
    user.password = await hash(user.password);
    var newUser = await User.create(user);
  } catch (err) {
    return next(err);
  }

  res.json(newUser);
});


/* Get all projects for user with :id */
router.get('/:id/projects', async function (req, res, next) {
  let id = req.params.id;

  try {
    var user = await User.where('id', id).limit(1).first();
    var projects = await user.projects().get();
  } catch (err) {
    return next(err);
  }

  res.render('index', { title: `Projects for ${user.name}`, results: projects });
});


/* Get department that user with :id works in */
router.get('/:id/department', async function (req, res, next) {
  let id = req.params.id;

  try {
    var user = await User.where('id', id).limit(1).first();
    var department = await user.department().first();
  } catch (err) {
    return next(err);
  }

  res.render('index', { title: `Department that ${user.name} works in.`, results: [department] });
});


module.exports = router;
