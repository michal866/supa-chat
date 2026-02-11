import { Component, inject, signal } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AuthService } from "../../services/auth.service";
import { SnackBarService } from "../../services/snack-bar.service";

@Component({
  selector: "app-login-help",
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: "./login-help.component.html",
  styleUrl: "./login-help.component.scss",
})
export default class LoginHelpComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBarService = inject(SnackBarService);

  protected readonly loading = signal(false);

  protected readonly emailForm = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
  });

  async onSendPasswordResetEmail() {
    if (this.emailForm.invalid) return;

    const { email } = this.emailForm.value;
    this.loading.set(true);

    try {
      const { data, error } = await this.authService.sendPasswordResetEmail(
        email ?? "",
      );

      if (error) {
        // snackbar
        return;
      }

      this.snackBarService.openSnackBar(
        "If an account exists for this email, a reset link has been sent.",
      );
      this.emailForm.reset();
    } catch (err) {
      // snackbar
    } finally {
      this.loading.set(false);
    }
  }
}
