const fs = require('fs');
const path = require('path');

const parkController = {
  getPark: (req, res) => {
    // Leer el archivo JSON de plazas
    const plazasData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/plazas.json'), 'utf8'));

    // Renderizar la vista y pasar los datos de las plazas
    res.render('park', { plazas: plazasData });
  },

  receiveDistanceFromArduino: (req, res) => {
    // Recibir la distancia del cuerpo de la solicitud POST
    const { distance } = req.body;
    
    // Realizar cualquier procesamiento necesario con la distancia recibida
    console.log(`Distancia recibida del Arduino: ${distance}`);
    
    // Pasar la distancia a la vista
    res.render('park', { distanceFromArduino: distance }); // Agregamos un log para asegurarnos de que la distancia se está pasando correctamente
  }
};

module.exports = parkController;
