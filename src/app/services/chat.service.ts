import { inject, Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Message } from "../shared/message.model";
import { of, retry } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { env } from "../../environments/environment.dev";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private readonly authService = inject(AuthService);
  private readonly httpClient = inject(HttpClient);

  private readonly currentSession = this.authService.currentSession;
  private readonly supabase = this.authService.supabaseClient;

  async fetchChannels() {
    const { data, error } = await this.supabase.from("rooms").select("*");
    if (error) {
      console.error(error);
    }
    return data;
  }

  fetchMessages(roomId: string | null) {
    if (!roomId) {
      console.warn("Room id is", roomId);
      return of([]);
    }

    const httpParams = new HttpParams()
      .set("select", "*,users(*)")
      .set("channel_id", `eq.${roomId}`)
      .set("order", `inserted_at.asc`);

    return this.httpClient
      .get<Message[]>(env.supabaseUrl + "rest/v1/messages", {
        params: httpParams,
        headers: {
          Apikey: env.supabasePublishableKey,
          authorization: `Bearer ${this.currentSession()?.access_token ?? ""}`,
        },
      })
      .pipe(retry({ count: 5, delay: 500 }));
  }

  async sendMessage(message: string | null, channelId: string | null) {
    if (!message || !channelId) return;

    const { error } = await this.supabase.from("messages").insert({
      channel_id: Number(channelId),
      content: message,
    });

    if (error) {
      console.error(error);
    }
  }

  async sendFileMessage(filePath: string | null, channelId: string | null) {
    if (filePath && channelId) {
      const { error } = await this.supabase.from("messages").insert({
        content: "",
        channel_id: Number(channelId),
        fileUrl: `${env.supabaseUrl}storage/v1/object/${filePath}`,
      });

      if (error) {
        console.error(error);
        alert(error.message);
      }
    }
  }

  uploadFile(files: File[] | null, channelId: string) {
    if (files) {
      try {
        const uploadPromises = files.map((file) => {
          return this.supabase.storage
            .from("user-uploads")
            .upload(`${channelId}/${file.name}`, file);
        });

        return uploadPromises;
      } catch (error) {
        console.error("Error uploading file:", error);
        return;
      }
    } else {
      console.warn("No files to upload");
      return;
    }
  }
}
