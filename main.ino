#include <HTTPClient.h>
#include <WiFi.h>

const char* ssid = ""; // Reemplaza con el nombre de tu red WiFi
const char* password = ""; // Reemplaza con la contraseña de tu red WiFi

const char* serverAddress = "http://192.168.x.x:3001/park"; // Reemplaza 192.168.x.x con tu dirección IP local

void setup() {
  pinMode(33, OUTPUT); // Trigger
  pinMode(32, INPUT);  // Echo
  digitalWrite(33, LOW);
  Serial.begin(9600);

  WiFi.begin(ssid, password);
  Serial.print("Conectando");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("Conectado con éxito, mi IP es: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    digitalWrite(33, HIGH);
    delayMicroseconds(10);
    digitalWrite(33, LOW);

    unsigned long duration = pulseIn(32, HIGH);
    float distance_cm = (duration * 0.034) / 2;

    Serial.print("La distancia en cm es de: ");
    Serial.println(distance_cm);

    // Convertir la distancia a String para enviar
    String distance = String(distance_cm) + " cm";
    String datos_a_enviar = "distance=" + distance;

    HTTPClient http;
    http.begin(serverAddress);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    int codigo_respuesta = http.POST(datos_a_enviar);

    if (codigo_respuesta > 0) {
      Serial.println("Código HTTP: " + String(codigo_respuesta));
      if (codigo_respuesta == 200) {
        String cuerpo_respuesta = http.getString();
        Serial.println("El servidor respondió: ");
        Serial.println(cuerpo_respuesta);
      }
    } else {
      Serial.println("Error enviando POST, código: " + String(codigo_respuesta));
    }
    http.end();

    delay(5000); // Espera 5 segundos antes de la siguiente lectura y envío
  } else {
    Serial.println("Error en la conexión WIFI");
  }

  delay(1000); // Delay para evitar leer la distancia muy frecuentemente
}
