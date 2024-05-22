const { body } = require("express-validator");

const registerValidations = {
  registerCheck: [
    body("nombre")
      .trim()
      .notEmpty()
      .withMessage("Debes ingresar un nombre para el usuario!")
      .bail()
      .isLength({
        min: 2,
      })
      .withMessage("El nombre debe tener al menos 2 caracteres"),

    body("apellido")
      .trim()
      .notEmpty()
      .withMessage("Debes ingresar un apellido!")
      .bail()
      .isLength({
        min: 2,
      })
      .withMessage("El apellido debe tener al menos 2 caracteres"),

    body("email")
      .notEmpty()
      .withMessage("Debes ingresar tu e-mail!")
      .bail()
      .trim()
      .isEmail()
      .withMessage("El e-mail es inválido")
      .bail()
      .custom((value, { req }) => {
        const email = req.body.email;
        const regexEmail = /^[a-zA-Z0-9._%+-]+@eafit.edu.co$/;
        const emailOk = regexEmail.test(email);

        if (!emailOk) {
          throw new Error("El e-mail es inválido. Debe ser un correo de eafit.edu.co");
        }

        return true;
      }),
  ],
};

module.exports = registerValidations;
