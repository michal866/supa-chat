import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AuthService } from "../../services/auth.service";
import { SnackBarService } from "../../services/snack-bar.service";

@Component({
  selector: "app-passwordless",
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: "./passwordless.component.html",
  styleUrl: "./passwordless.component.scss",
})
export default class PasswordlessComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBarService = inject(SnackBarService);

  protected readonly emailForm = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
  });

  loading = signal(false);

  async onSendMagicLink() {
    const { email } = this.emailForm.value;

    if (this.emailForm.invalid) return;

    try {
      this.loading.set(true);
      const { error } = await this.authService.signInWithEmail(email ?? "");

      if (error) {
        // snackbar
        return;
      }

      this.snackBarService.openSnackBar("Check your email for the login link");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.emailForm.reset();
      this.loading.set(false);
    }
  }
}
