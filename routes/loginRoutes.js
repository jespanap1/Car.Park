const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');
const middlewares = require('../middlewares/authMiddlewares');

router.get('/', middlewares.allowUnsignedIn ,loginController.getLogin);

router.post('/', loginController.signIn);

router.get('/sign-out', loginController.signOut);

module.exports = router;