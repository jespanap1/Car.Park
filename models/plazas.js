const fs = require('fs');
const path = require('path');
const moment = require('moment'); // Importar solo Moment.js

const model = {
  route: path.join(__dirname, '../data/plazas.json'),

  obtenerValorSensorUltrasonido: function () {
    // Aquí puedes colocar la lógica para obtener el valor del sensor de ultrasonido
    // Por ahora, simplemente devolvemos un valor aleatorio entre 0 y 100 como ejemplo
    const sensorValue = Math.floor(Math.random() * 101);
    console.log('Valor del sensor de ultrasonido:', sensorValue);
    return sensorValue;
  },

  actualizarPlaza1: function (ocupada) {
    fs.readFile(this.route, 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo JSON:', err);
        return;
      }

      try {
        const plazas = JSON.parse(data);
        const plaza1 = plazas.find(plaza => plaza.id === 1);

        if (plaza1) {
          console.log('Estado actual de plaza1:', plaza1.status);
          plaza1.status = ocupada;
          plaza1.lastModified = moment().toISOString();
          console.log('Nuevo estado de plaza1:', plaza1.status);

          fs.writeFile(this.route, JSON.stringify(plazas, null, 2), 'utf8', (err) => {
            if (err) {
              console.error('Error al escribir el archivo JSON:', err);
            } else {
              console.log('Estado de la plaza 1 actualizado con éxito.');
            }
          });
        }
      } catch (error) {
        console.error('Error al analizar el archivo JSON:', error);
      }
    });
  },

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
          const currentTime = moment(); // Obtener el tiempo actual correctamente
  
          const plaza1 = plazas.find(plaza => plaza.id === 1);
          if (plaza1) {
            const plaza1Time = moment(plaza1.lastModified); // Obtener el tiempo de la última modificación de la plaza 1 correctamente
            const secondsDiff = currentTime.diff(plaza1Time, 'seconds');
  
            console.log(`secondsDiff for plaza 1: ${secondsDiff}`);
            if (secondsDiff >= 3) { // Cambiar el intervalo de tiempo a 3 segundos
              console.log('Plaza 1 modificada');
              const sensorValue = this.obtenerValorSensorUltrasonido();
              plaza1.status = (sensorValue < 20);
              plaza1.lastModified = currentTime.toISOString();
            }
          }
  
          plazas.forEach((plaza) => {
            if (plaza.id !== 1) {
              plaza.status = Math.random() >= 0.5;
            }
          });
  
          fs.writeFile(this.route, JSON.stringify(plazas, null, 2), 'utf8', (err) => {
            if (err) {
              console.error('Error al escribir el archivo JSON:', err);
              return;
            }
  
            console.log('Archivo JSON actualizado con éxito.');
          });
        } catch (error) {
          console.error('Error al analizar el archivo JSON:', error);
        }
      });
    }, 3000); // Cambiar el intervalo de tiempo a 3000 milisegundos (3 segundos)
  },
  
};

module.exports = model;
