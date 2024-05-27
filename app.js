const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const plazasModel = require('./models/plazas');

const app = express();

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json()); // <-- Esto es crucial

// Middleware para parsear el cuerpo de las solicitudes con URL encoded
app.use(express.urlencoded({ extended: true }));

// Otros middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(expressSession({ secret: 'este es mi secreto monito123' }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

// Middleware para gestión de cookies
app.use((req, res, next) => {
  if (req.cookies.email) {
    const userModel = require('./models/user');
    const user = userModel.findByEmail(req.cookies.email);
    delete user.id;
    delete user.password;
    req.session.user = user;
  }
  next();
});

// Rutas
const homeRoutes = require('./routes/homeRoutes');
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const parkRoutes = require('./routes/parkRoutes');

app.use('/', homeRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/park', parkRoutes);

// Ruta para actualizar la plaza 1
app.post('/updatePlaza1', (req, res) => {
  const { plazaOcupada } = req.body;
  const ocupada = plazaOcupada === true;
  plazasModel.actualizarPlaza1(ocupada);
  res.sendStatus(200);
});

// Iniciar el servidor
app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
  plazasModel.modifyPlazaStates();
});
