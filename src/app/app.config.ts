import {
  ApplicationConfig,
  ErrorHandler,
  provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { CustomErrorHandler } from "./custom-error-handler";

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler,
    },
    BrowserModule,
    provideHttpClient(withInterceptors([])),
    provideAnimationsAsync(),
  ],
};
