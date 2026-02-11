import { Profile } from "./profile.model";

export interface Room {
  readonly members: Profile[];
  readonly membersUids: string[];
  readonly mutedUids: string[];
  readonly ownersUids: string[];
  readonly roomId: string;
  readonly roomName: string;
  readonly roomPicture: string;
}
