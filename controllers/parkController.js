const fs = require('fs');
const path = require('path');

const parkController = {
  getPark: (req, res) => {
    // Leer el archivo JSON de plazas
    const plazasData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/plazas.json'), 'utf8'));

    // Renderizar la vista y pasar los datos de las plazas
    res.render('park', { plazas: plazasData });
  },
};

module.exports = parkController;
