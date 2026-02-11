import { inject, Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { FileInputValue } from "@ngx-dropzone/cdk";

@Injectable({
  providedIn: "root",
})
export class RoomService {
  private readonly authService = inject(AuthService);

  private readonly supabase = this.authService.supabaseClient;

  async createRoom(newChannelName?: string | null, roomImg?: FileInputValue) {
    const { data, error } = await this.supabase
      .from("channels")
      .insert({
        slug: newChannelName ?? undefined,
        // channel_avatar_url: roomImg ?? undefined,
      })
      .select("slug")
      .single();

    if (error) {
      console.error("createRoom error: ", error);
      throw error;
    }

    return data;
  }
}
