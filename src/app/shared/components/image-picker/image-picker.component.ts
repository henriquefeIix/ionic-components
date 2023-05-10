import { Component, Output, EventEmitter } from '@angular/core';
import { Camera } from '@capacitor/camera';
import { CameraResultType, CameraSource, Photo, GalleryPhoto } from '@capacitor/camera/dist/esm/definitions';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent {

  @Output() imagesUploadEvent = new EventEmitter<Photo | GalleryPhoto[]>();

  constructor(
    private actionSheetCtrl: ActionSheetController
  ) { }

  async presentActionSheet(): Promise<void> {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: "From Photos",
          handler: () => this.pickImages()
        },
        {
          text: "Take Picture",
          handler: () => this.takePicture()
        }
      ],
    });

    await actionSheet.present();
  }

  pickImages(): void {
    Camera.pickImages({ quality: 100 }).then((images) => {
      this.imagesUploadEvent.emit(images.photos);
    }).catch((error) => console.log(error));
  }

  takePicture(): void {
    Camera.getPhoto({
      quality: 100,
      source: CameraSource.Camera,
      saveToGallery: true,
      resultType: CameraResultType.Uri
    }).then((image) => {
      this.imagesUploadEvent.emit(image);
    }).catch((error) => console.log(error));
  }

}
