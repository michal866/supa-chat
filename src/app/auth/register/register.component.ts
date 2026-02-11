import { Component, inject, signal } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { SnackBarService } from "../../services/snack-bar.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  imports: [
    RouterLink,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export default class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snackBarService = inject(SnackBarService);

  protected readonly hidePassword = signal(true);
  protected readonly loading = signal(false);

  protected readonly registerForm = this.formBuilder.group({
    username: [""],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });

  togglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }

  generateUsername(event: MouseEvent) {
    const uuid = crypto.randomUUID().slice(0, 8);
    this.registerForm.patchValue({ username: uuid });
    event.stopPropagation(); // prevent keyboard from opening
  }

  async onSignUp() {
    if (this.registerForm.invalid) return;

    const { username, email, password } = this.registerForm.value;

    this.loading.set(true);

    try {
      const { error } = await this.authService.signUpWithPassword(
        email ?? "",
        password ?? "",
        username ?? "",
      );

      if (error) {
        alert(error.message);
        // snackbar
        return;
      }

      this.snackBarService.openSnackBar("Signup successful");
      this.router.navigate(["/chat"]);
    } catch (err) {
      // snackbar
    } finally {
      this.loading.set(false);
    }
  }
}
