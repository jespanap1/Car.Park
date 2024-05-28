const fs = require('fs');
const path = require('path');
const moment = require('moment'); // Importar solo Moment.js

const model = {
  route: path.join(__dirname, '../data/plazas.json'),

  modifyPlazaStates: function () {
    setInterval(() => {
      console.log('Iniciando la modificación de estados...'); // Mensaje de depuración
      fs.readFile(this.route, 'utf8', (err, data) => {
        if (err) {
          console.error('Error al leer el archivo JSON:', err);
          return;
        }
  
        console.log('Archivo JSON leído correctamente.'); // Mensaje de depuración
  
        try {
          const plazas = JSON.parse(data);
  
          // Obtener la hora actual
          const currentTime = moment();
  
          // Modificar el status de las plazas en función de la hora actual
          plazas.forEach((plaza) => {
            const plazaTime = moment(plaza.lastModified);
            const secondsDiff = currentTime.diff(plazaTime, 'seconds');
  
            console.log(`secondsDiff: ${secondsDiff}`);
            if (secondsDiff >= 30) {
              console.log(`Plaza modificada: ${plaza.id}`);
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
  
            console.log('Archivo JSON actualizado con éxito.'); // Mensaje de depuración
          });
        } catch (error) {
          console.error('Error al analizar el archivo JSON:', error);
        }
      });
    }, 20000); // 20,000 milisegundos (20 segundos)
  },
};

module.exports = model;