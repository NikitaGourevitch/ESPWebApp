import { Component ,OnInit } from '@angular/core';
import {Esp} from './../class/esp'
import {_} from 'lodash';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit{

  title = 'Heat Controller';


   testEsp = {
    tempNow: "22",
    ip: "monip",
    tempMin: "22",
    modeAuto: false,
    radiatorOn: true,
    captorName: "TEST Sale TD 12"
  }

  espList = new Array();
  action = false;
  lastRequest = Date.now();
  ngOnInit(){

    this.espList.push(this.testEsp);

    this.getEspFromServer();
    setInterval(function(){
      if(!this.action){
        this.getEspFromServer();
      }
    }.bind(this),1000);
  }

  valueChanged(e, esp) {
    esp.tempMin = e;
  }


  getEspFromServer() {
    let url = "http://172.20.10.3:3000/ApiRadiator";

    console.log("Je vais chercher les esp sur : "+ url)

    fetch(url)
      .then((reponseJSON) => {
        //console.log("reponse json");
        return reponseJSON.json();
      })
      .then((reponseJS) => {
        // ici on a une réponse en JS
       /* var newAspList = reponseJS.esp;

        for(var i = 0; i<this.espList.length;i++){
          if(this.espList[i]!== newAspList[i]){
            this.espList[i]=newAspList[i];
          }
        }*/
        this.lastRequest = Date.now();
        this.espList = reponseJS.esp;
        console.log( this.espList);
      })
      .catch((err) => {
        console.log("Une erreur est intervenue " + err);
      })
  }
  togleMode(esp){
    esp.modeAuto = !esp.modeAuto;

    this.changeEsp(esp);
  }

  togleSwitch(esp){
    esp.radiatorOn = !esp.radiatorOn;
    this.changeEsp(esp);
  }

  changeEsp(esp){
    let url = "http://172.20.10.3:3000/ApiRadiator";
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(esp)
      })
      .then((responseJSON) => {
        responseJSON.json()
          .then((res) => { // arrow function préserve le this
            // Maintenant res est un vrai objet JavaScript
            console.log("espmis à jour");
            console.log(res);
          });
      })
      .catch(function (err) {
        console.log(err);
      });
    this.action=false;
  }


}

