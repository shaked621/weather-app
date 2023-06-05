import { Component, OnDestroy, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';
import { NgForm } from '@angular/forms';
import { WeatherData } from './model/weather.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit, OnDestroy {
  counter: number | undefined;
  isLoading = false;
  weatherData: WeatherData | undefined;
  private weatherStatusSub: Subscription | undefined;
  private weatherDataSub: Subscription | undefined;
  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.counter = this.weatherService.getCounter();
    this.isLoading = true;
    this.weatherService.getWeather();
    this.weatherDataSub = this.weatherService
      .getWeatherDataUpdated()
      .subscribe((weatherData) => {
        this.weatherData = weatherData;
      });
    this.weatherStatusSub = this.weatherService
      .getWeatherStatusListener()
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.weatherStatusSub?.unsubscribe();
    this.weatherDataSub?.unsubscribe();
  }
}
