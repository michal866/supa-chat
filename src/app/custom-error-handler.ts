import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  handleError(err: unknown) {
    if (err instanceof Error) {
    }

    if (err instanceof HttpErrorResponse) {
      if (err.error instanceof ErrorEvent) {
        console.warn("Client error", err.message);
      } else {
        console.warn("Server error", err);
      }
    } else {
      console.warn("Application error", err);
    }
  }
}
