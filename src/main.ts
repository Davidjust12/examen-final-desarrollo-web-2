import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/routes';
bootstrapApplication(AppComponent, { providers: [provideHttpClient(), provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }))] }).catch(console.error);
