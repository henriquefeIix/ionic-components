import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { ImageService } from '../shared/services/image.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { LocalFile } from '../home/home.page';

@Component({
  selector: 'app-images',
  templateUrl: './images.page.html',
  styleUrls: ['./images.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SharedModule]
})
export class ImagesPage implements OnInit {

  images!: LocalFile[];
  swiperRef: ElementRef | undefined;

  constructor(
    private imageService: ImageService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.imageService.images$.pipe(
      tap((value) => value.length === 0 && this.router.navigate(['/home']))
    ).subscribe((value) => this.images = value);
  }

  onSwiperDidLoad(swiper: ElementRef) {
    this.swiperRef = swiper;
  }

  deleteImage(): void {
    const index = this.swiperRef?.nativeElement.swiper.activeIndex;
    this.images.splice(index, 1);
    this.swiperRef?.nativeElement.swiper.removeSlide(index);
    this.swiperRef?.nativeElement.swiper.update();
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.imageService.setImages(this.images);
  }

}
