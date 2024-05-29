const fs = require('fs');
const path = require('path');

const parkController = {
  getPark: (req, res) => {
    // Leer el archivo JSON de plazas
    const plazasData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/plazas.json'), 'utf8'));

    // Renderizar la vista y pasar los datos de las plazas
    res.render('park', { plazas: plazasData, distanceFromArduino: null });
  },

  receiveDistanceFromArduino: (req, res) => {
    // Recibir la distancia del cuerpo de la solicitud POST
    const { distance } = req.body;
    
    // Realizar cualquier procesamiento necesario con la distancia recibida
    console.log(`Distancia recibida del Arduino: ${distance}`);
    
    // Leer el archivo JSON de plazas
    const plazasData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/plazas.json'), 'utf8'));

    // Actualizar el estado de plaza1 (plaza con id 1)
    const plaza1 = plazasData.find(plaza => plaza.id === 1);

    if (plaza1) {
      const distanceCm = parseFloat(distance);
      if (!isNaN(distanceCm)) {
        plaza1.status = distanceCm < 20;
        plaza1.lastModified = new Date().toISOString();
      }
    }

    // Escribir los cambios de nuevo en el archivo JSON
    fs.writeFileSync(path.join(__dirname, '../data/plazas.json'), JSON.stringify(plazasData, null, 2), 'utf8');
    
    // Renderizar la vista y pasar los datos actualizados de las plazas
    res.render('park', { plazas: plazasData, distanceFromArduino: distance });
  }
};

module.exports = parkController;
