import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SnackBarService {
  private readonly matSnackBar = inject(MatSnackBar);

  openSnackBar(message: string) {
    this.matSnackBar.open(message, "Dismiss", {
      duration: 5000,
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }

  openErrSnackBar(err: unknown) {
    // console.error("error:", err);

    if (err instanceof HttpErrorResponse) {
      console.error("http error response", err);
      this.matSnackBar.open(
        err.status === 0 ? err.statusText : err.error.message,
        "Dismiss",
        {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "top",
        },
      );
    }
  }
}
