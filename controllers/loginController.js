const userModel = require("../models/user.js");
const path = require("path");
const bcrypt = require('bcrypt');

const controller = {
  
  getLogin: (req, res) => {
    res.render('login');
  },

  signIn: (req, res) => {
    const searchedUser = userModel.findByEmail(req.body.email);

    if (!searchedUser) {
      return res.redirect('login?error=El mail o la contraseña son incorrectos');
    }

    const { password: hashedPw } = searchedUser;
    const isCorrect = bcrypt.compareSync(req.body.password, hashedPw);

    if (isCorrect) {
      if (!!req.body.remember) {
        res.cookie('email', searchedUser.email, {
          maxAge: 1000 * 60 * 60 * 24 * 360 * 9999
        });
      }

      delete searchedUser.password;
      delete searchedUser.id;

      req.session.user = searchedUser;

      res.redirect('/');
    } else {
      return res.redirect('login?error=El mail o la contraseña son incorrectos');
    }
  },

  signOut: (req, res) => {
    res.clearCookie('email');

    req.session.user = {};

    res.redirect('/');
  }
};

module.exports = controller;
