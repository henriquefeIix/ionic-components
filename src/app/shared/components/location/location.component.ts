import { Component, Output, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Geolocation, Position } from '@capacitor/geolocation';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent {

  @Output() dismissEvent = new EventEmitter<Position>();

  constructor(private alertCtrl: AlertController) { }

  async getLocation(): Promise<void> {
    const location = await Geolocation.getCurrentPosition();
    (await this.createAlert(location)).present();
  }

  async createAlert(location: Position): Promise<HTMLIonAlertElement> {
    const alert = await this.alertCtrl.create({
      header: "Current Location",
      buttons: ["OK"],
      inputs: [
        {
          placeholder: "Latitude",
          attributes: {
            value: location.coords.latitude
          },
        },
        {
          placeholder: "Longitude",
          attributes: {
            value: location.coords.longitude
          },
        },
      ],
    });

    alert.onDidDismiss().then(() => this.dismissEvent.emit(location));
    return alert;
  }

}
