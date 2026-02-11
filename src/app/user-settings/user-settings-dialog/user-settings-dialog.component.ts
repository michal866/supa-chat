import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { AuthService } from "../../services/auth.service";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-user-settings-dialog",
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogContent,
    MatDialogTitle,
    MatSelectModule,
  ],
  templateUrl: "./user-settings-dialog.component.html",
  styleUrl: "./user-settings-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsDialogComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);

  protected readonly currentUser = this.authService.currentUser;

  protected loading = signal(false);

  protected updateProfileForm = this.formBuilder.group({
    email: this.currentUser()?.email,
    username: this.currentUser()?.user_metadata["display_name"] as string,
    avatar_url: "",
  });

  async updateProfile() {}

  async signOut() {
    await this.authService.signOut();
  }
}
