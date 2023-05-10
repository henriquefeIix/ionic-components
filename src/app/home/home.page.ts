import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Photo, GalleryPhoto } from '@capacitor/camera/dist/esm/definitions';
import { Position } from '@capacitor/geolocation';
import { ActionSheetController, IonicModule } from '@ionic/angular';
import { ImageService } from '../shared/services/image.service';
import { SpeechRecognitionService } from '../shared/services/speech-recognition.service';
import { SharedModule } from '../shared/shared.module';

export interface LocalFile {
  name: string;
  data: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class HomePage implements OnInit {

  recording = false;
  images: LocalFile[] = [];

  form = this.fb.group({
    description: ["", Validators.required]
  });

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private fb: FormBuilder,
    private imageService: ImageService,
    private router: Router,
    private speechRecognitionService: SpeechRecognitionService
  ) { }

  ngOnInit(): void {
    this.speechRecognitionService.initialize();
    this.speechRecognitionService.recording$.subscribe((value) => { this.recording = value });
    this.imageService.images$.subscribe((images) => this.images = images);
  }

  startListening(): void {
    if (this.speechRecognitionService.available) {
      this.speechRecognitionService.start().subscribe({
        next: (value) => {
          this.form.get('description')?.setValue(value);
        },
        error: (error) => console.error(error)
      });
    }
  }

  stopListening(): void {
    this.speechRecognitionService.stop();
  }

  async onImagesUpload(images: Photo | GalleryPhoto[]): Promise<void> {
    if (images instanceof Array) {
      images.forEach(async (image) => {
        this.images.push({
          name: crypto.randomUUID(),
          data: await this.imageService.convert(image)
        });
      });
    } else {
      this.images.push({
        name: crypto.randomUUID(),
        data: await this.imageService.convert(images)
      });
    }
  }

  viewImages(): void {
    if (this.images.length > 0) {
      this.imageService.setImages(this.images);
      this.router.navigate(['/images']);
    }
  }

  onLocationDismiss(location: Position): void {
    const { latitude, longitude } = location.coords;
    console.log(latitude, longitude);
  }

  async save(): Promise<void> {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: "Save",
          handler: () => console.log('Save selected')
        },
        {
          text: "Save As Draft",
          handler: () => console.log('Save As Draft selected')
        }
      ],
    });

    await actionSheet.present();
  }

}
