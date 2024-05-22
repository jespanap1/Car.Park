const express = require("express");
const router = express.Router();

const registerController = require("../controllers/registerController");
const controller = require("../controllers/homeController");
const middlewares = require("../middlewares/authMiddlewares");

router.get("/", middlewares.allowUnsignedIn, registerController.getRegister);

router.post("/", registerController.postUser);

module.exports = router;
