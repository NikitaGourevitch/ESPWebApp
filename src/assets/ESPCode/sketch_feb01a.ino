#include "ArduinoHttpClient.h"
#include "WiFi.h"
#include "ArduinoJson.h"
#include "DallasTemperature.h"
#include "OneWire.h"
/***************** MANUAL CONFIGURATION ************************/
const char* ssid     = "TODO"; //local wifi SSID to set !!!! 
const char* password = "TODO";                  //local wifi password to set !!!! 

const char serverAddress[] = "TODO";          // API server adress to set !!!!
int port = 3000;                                    // API port adress to set !!!!
int loopWait = 1000;                            // time yeld between loop
/***************************************************************/

// init valures
float tempNow = 20.0;
float tempBeffore = 0.0;
float tempMin = 0.0;
String captorName = "new";
bool  radiatorOn = false;
bool modeAuto = true;
String macAdress = "";


// init PIN
int pinRadiator = 23;
int pinTemperature = 22;


// set sensor
OneWire oneWire(pinTemperature);
DallasTemperature tempSensor(&oneWire);

//connect to wifi
IPAddress ip;
WiFiClient wifi;
HttpClient serv = HttpClient(wifi, serverAddress, port);
int status = WL_IDLE_STATUS;
void setup() {
  Serial.begin(9600);
  tempSensor.begin();
  pinMode (pinRadiator , OUTPUT);
  while(!Serial);
 WiFi.begin(ssid,password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  macAdress = WiFi.macAddress();
  ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
}

void loop() {

  String radiatorPath = "/radiator" ;
  String contentType = "application/json";
  String getThis = radiatorPath +"/"+ ip;
  Serial.println(getThis);
  serv.get(getThis);
  int HttpRetCode = serv.responseStatusCode();
  //update status
  if(HttpRetCode > 0){
      DynamicJsonBuffer jsonBuffer(300);
      JsonObject& parsed = jsonBuffer.parseObject(serv.responseBody());

      tempMin = parsed["esp"]["tempMin"].as <float>();
      radiatorOn = parsed["esp"]["radiatorOn"].as <bool>();
      modeAuto = parsed["esp"]["modeAuto"].as<bool>();
      Serial.print("ce qon a recu");
      Serial.print(tempNow);
      Serial.print(tempMin);
      Serial.print(radiatorOn);
      Serial.print(modeAuto);

          if(modeAuto){
             if(tempNow < tempMin ){
          radiatorOn = true;
          digitalWrite(pinRadiator,HIGH);
          }else{
         radiatorOn = false;
         digitalWrite(pinRadiator,LOW);
          }
          }else {
            if(radiatorOn){
              digitalWrite(pinRadiator,HIGH);
            }else{
              digitalWrite(pinRadiator,LOW);
            }
          }
  }

  // create json data string
  tempSensor.requestTemperaturesByIndex(0);
  tempNow=tempSensor.getTempCByIndex(0);

  String postData = "{\"tempNow\":\"";
  postData += tempNow;
  postData += "\",";
  postData += "\"ip\":\"";
  postData += ip;
  postData += "\",";
  postData += "\"tempMin\":\"";
  postData += tempMin;
  postData += "\",";
  postData += "\"modeAuto\":\"";
  postData += modeAuto;
  postData += "\",";
  postData += "\"radiatorOn\":\"";
  postData += radiatorOn;
  postData += "\",";
  postData += "\"captorName\":\"";
  postData += captorName;
  postData += "\"}";

  Serial.println("making POST request");

  // send the POST request
  serv.post(radiatorPath, contentType, postData);

  // read the status code and body of the response
  int statusCode = serv.responseStatusCode();
  String response = serv.responseBody();

  Serial.print("Status code: ");
  Serial.println(statusCode);
  Serial.print("Response: ");
  Serial.println(response);



  delay(loopWait);
}
