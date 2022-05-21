const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin', (req, res) => {

  res.render('users/signin');
})

router.post('/users/signin', passport.authenticate('local', {

  successRedirect: '/notes',
  failureRedirect: '/users/signin',
  failureFlash: true

}));


router.get('/users/signup', (req, res) => {

  res.render('users/signup');

});

router.post('/users/signup', async (req, res) => {

  let errors = [];
  const {
    name,
    email,
    password,
    confirm_password
  } = req.body;
  console.log(req.body);
  if (password != confirm_password) {
    errors.push({
      text: "contraseñas no coinciden"
    });
  }
  if (password.length < 4) {
    errors.push({
      text: "contraseña debe ser mayor a 4 caracteres."
    });
  }
  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      name,
      email,
      password,
      confirm_password,
    });
  } else {
    // Look for email coincidence
    const emailUser = await User.findOne({
        email: email
      })
      .then(data => {
        console.log(`datos ${data}`)
        if(data){
          return {
            email: data.email
          }
        }
      })
    if (emailUser) {
      req.flash("error_msg", "The Email is already in use.");
      res.redirect("/users/signup");
    } else {
      // Saving a New User
      const newUser = new User({
        name,
        email,
        password
      });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash("success_msg", "You are registered.");
      res.redirect("/users/signin");
    }
  }
});

router.get('/users/logout', (req, res) => {

  req.logOut();
  res.redirect('/');

});


module.exports = router;