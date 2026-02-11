import { Profile } from "./profile.model";

export interface Message {
  readonly channel_id: string;
  readonly fileUrl?: string;
  readonly id: string;
  readonly inserted_at: string;
  readonly content: string;
  readonly sameSender?: boolean;
  readonly user_id: string;
  readonly users?: Profile;
}
