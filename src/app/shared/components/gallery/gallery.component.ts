import { Component, AfterViewInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { LocalFile } from 'src/app/home/home.page';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements AfterViewInit {

  @Input() images!: LocalFile[];
  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  @Output() swiperEvent = new EventEmitter<ElementRef>();

  ngAfterViewInit(): void {
    this.swiperEvent.emit(this.swiperRef);
  }

}
