import { Component, inject, signal } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router, RouterLink } from "@angular/router";
import { ReactiveFormsModule, Validators, FormBuilder } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { SnackBarService } from "../../services/snack-bar.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  imports: [
    RouterLink,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export default class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snackBarService = inject(SnackBarService);

  protected readonly hidePassword = signal(true);
  protected readonly loading = signal(false);

  protected readonly loginForm = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: [""],
  });

  async onSignIn() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.loading.set(true);

    try {
      const { data, error } = await this.authService.signInWithPassword(
        email ?? "",
        password ?? "",
      );

      if (error) {
        alert(error.message);
        // snackbar
        return;
      }

      this.router.navigate(["/chat"]);
    } catch (error) {
      // snackbar
    } finally {
      this.loading.set(false);
    }
  }

  togglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }
}
