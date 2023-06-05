import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map } from 'rxjs';

import { environment } from 'src/environments/environments';
import { WeatherData } from './model/weather.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private weatherData: WeatherData | undefined;
  private counter: number = 0;
  private weatherStatusListener = new Subject<boolean>();
  private weatherDataUpdated = new Subject<WeatherData>();

  BACKEND_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCounter(): number {
    return this.counter;
  }

  setCounter(count: number): void {
    this.counter = count;
  }

  getWeatherStatusListener() {
    return this.weatherStatusListener.asObservable();
  }

  getWeatherDataUpdated() {
    return this.weatherDataUpdated.asObservable();
  }

  getWeather() {
    this.http
      .get<{ message: string; weatherData: WeatherData }>(
        this.BACKEND_URL + 'api/get/weather'
      )
      .pipe(
        map((weather) => {
          return {
            temperature: weather.weatherData.temperature,
            winddirection: weather.weatherData.winddirection,
            windspeed: weather.weatherData.windspeed,
          };
        })
      )
      .subscribe({
        next: (data) => {
          this.weatherData = data;
          this.weatherDataUpdated.next({ ...this.weatherData });
          this.weatherStatusListener.next(true);
        },
        error: (error) => {
          console.log(error);
          this.weatherStatusListener.next(false);
        },
      });
  }
}
