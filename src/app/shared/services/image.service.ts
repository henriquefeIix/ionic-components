import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Photo, GalleryPhoto } from '@capacitor/camera/dist/esm/definitions';
import { LocalFile } from 'src/app/home/home.page';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private imagesBus = new BehaviorSubject<LocalFile[]>([]);
  images$ = this.imagesBus.asObservable();

  async convert(image: Photo | GalleryPhoto): Promise<string> {
    const blob = await this.getImageAsBlob(image.webPath!);
    return await this.convertBlobToBase64(blob) as string;
  }

  async getImageAsBlob(image: string): Promise<Blob> {
    const response = await fetch(image);
    return response.blob();
  }

  private convertBlobToBase64(blob: Blob): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  setImages(images: LocalFile[]) {
    this.imagesBus.next(images);
  }

}
