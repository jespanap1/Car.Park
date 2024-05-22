const path = require('path');

const controller = {
  getHome: (req, res) => {
    //res.sendFile(path.join(__dirname, '../views/home.html'));
    let userData = req.session.user;
    if (!userData) {
      userData = {}
    }
    res.render('home', {title: 'Car.Park', userData});
  },
};

module.exports = controller;