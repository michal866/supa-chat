import { inject, Injectable } from "@angular/core";
import { User } from "@supabase/supabase-js";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly authService = inject(AuthService);
  private readonly supabase = this.authService.supabaseClient;
  protected readonly currentUser = this.authService.currentUser;

  async fetchExtraUserInfo() {
    const { data, error } = await this.supabase
      .from("users")
      .select()
      .eq("id", this.currentUser()?.id ?? "")
      .single();

    if (error) console.error(error);

    return data;
  }

  uploadAvatar() {}

  updateProfile(profile: User) {}
}
