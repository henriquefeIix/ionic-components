import { Injectable } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { UtteranceOptions } from '@capacitor-community/speech-recognition/dist/esm/definitions';
import { Platform } from '@ionic/angular';
import {
  BehaviorSubject, Observable, Subject, throwError
} from 'rxjs';

declare var webkitSpeechRecognition: any;

const defaultOptions: UtteranceOptions = {
  language: 'pt-BR',
  maxResults: 2,
  partialResults: true,
  popup: true
}

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {

  recognition?: any;
  options!: UtteranceOptions;
  available!: boolean;

  private recordingSubject = new BehaviorSubject<boolean>(false);
  recording$ = this.recordingSubject.asObservable();

  private transcriptionSubject = new Subject<string>();
  transcription$ = this.transcriptionSubject.asObservable();

  constructor(private platform: Platform) {
    if (this.platform.is('mobile')) {
      SpeechRecognition.available().then((value) => this.available = value.available);
    } else {
      this.available = ('webkitSpeechRecognition' in window);
    }
  }

  initialize(options?: UtteranceOptions): void {
    if (this.available) {
      this.options = { ...defaultOptions, ...options };

      if (this.platform.is('mobile')) {
        SpeechRecognition.requestPermission();
      } else {
        this.recognition = new webkitSpeechRecognition();
        this.recognition.lang = this.options.language;
        this.recognition.interimResults = this.options.partialResults;
        this.recognition.maxAlternatives = this.options.maxResults;
        this.recognition.continuous = true;

        this.recognition.onresult = (event: any) => {
          const result = Array.from(event.results).map((result: any) => result[0]);
          const transcript = result.map((result: any) => result.transcript).join('');
          this.transcriptionSubject.next(transcript);
        }
      }
    }
  }

  start(): Observable<string> {
    if (this.available) {
      if (this.platform.is('mobile')) {
        SpeechRecognition.start(this.options).then((value) => {
          const transcript = (value && value.matches.length > 0) ? value.matches[0] : '';
          this.transcriptionSubject.next(transcript);
        })
      } else {
        this.recognition.start();
        this.recognition.onend = () => this.stop();
      }

      this.recordingSubject.next(true);
      return this.transcription$;
    } else {
      return throwError(() => new Error('Speech recognition not available on this device'))
    }

  }

  stop(): void {
    if (this.available) {
      this.platform.is('mobile') ? SpeechRecognition.stop() : this.recognition.stop();
      this.recordingSubject.next(false);
    }
  }

}
