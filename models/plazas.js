const fs = require('fs');
const path = require('path');
const moment = require('moment'); // Importar solo Moment.js

const model = {
  route: path.join(__dirname, '../data/plazas.json'),

  modifyPlazaStates: function () {
    setInterval(() => {
      fs.readFile(this.route, 'utf8', (err, data) => {
        if (err) {
          return;
        }
        try {
          const plazas = JSON.parse(data);
  
          // Obtener la hora actual
          const currentTime = moment();
  
          // Modificar el status de las plazas en función de la hora actual
          plazas.forEach((plaza) => {
            const plazaTime = moment(plaza.lastModified);
            const secondsDiff = currentTime.diff(plazaTime, 'seconds');

            if (secondsDiff >= 30) {
              // Modificando el status de las plazas de manera aleatoria
              plaza.status = Math.random() >= 0.5;
              // Ajustar la fecha para reflejar el pasado
              plaza.lastModified = currentTime.toISOString();
            }
          });
  
          // Escribir los cambios de nuevo en el archivo JSON
          fs.writeFile(this.route, JSON.stringify(plazas, null, 2), 'utf8', (err) => {
            if (err) {
              console.error('Error al escribir el archivo JSON:', err);
              return;
            }
          });
        } catch (error) {
          console.error('Error al analizar el archivo JSON:', error);
        }
      });
    }, 20000); // 20,000 milisegundos (20 segundos)
  },
};

module.exports = model;