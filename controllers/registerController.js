const userModel = require("../models/user.js");
const bcrypt = require("bcrypt");
const path = require("path");
const { validationResult } = require("express-validator");
const registerValidations = require("../middlewares/validations/registerValidations.js"); 

const controller = {
  getRegister: (req, res) => {
    //res.sendFile(path.join(__dirname, "../views/register.html"));
    res.render('register');
  },

  postUser: [
    // Utiliza las validaciones del archivo registerValidations
    registerValidations.registerCheck,

    (req, res) => {
      // Verifica si hay errores de validación
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // Si hay errores, muestra una respuesta con los errores de validación
        return res.render('register', { errors: errors.array() });
      }

      // Crear un objeto de usuario con los datos del formulario
      const newUser = {
        ...req.body
      };

      // Haseheamos la contraseña
      const newPassword = bcrypt.hashSync(newUser.password, 12);

      newUser.password = newPassword;

      // Llamar a la función para crear un nuevo usuario en el modelo
      userModel.createOne(newUser);

      // Redirigir o responder al cliente según tus necesidades
      // Puedes redirigir al usuario a una página de éxito o enviar una respuesta de éxito
      res.send("Usuario registrado exitosamente");
    },
  ],
};

module.exports = controller;
