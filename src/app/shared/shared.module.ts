import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { GalleryComponent } from './components/gallery/gallery.component';
import { ImagePickerComponent } from './components/image-picker/image-picker.component';
import { LocationComponent } from './components/location/location.component';

@NgModule({
  declarations: [
    GalleryComponent,
    ImagePickerComponent,
    LocationComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    GalleryComponent,
    ImagePickerComponent,
    LocationComponent
  ]
})
export class SharedModule { }
