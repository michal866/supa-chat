import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  OnDestroy,
  OnInit,
  resource,
  signal,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePipe, CommonModule } from "@angular/common";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatToolbarModule } from "@angular/material/toolbar";
import {
  BreakpointObserver,
  Breakpoints,
  LayoutModule,
} from "@angular/cdk/layout";
import { MatMenuModule } from "@angular/material/menu";
import { AuthService } from "../services/auth.service";
import { ChatService } from "../services/chat.service";
import { catchError, from, map, of, switchMap, tap } from "rxjs";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { RoomService } from "../services/room.service";
import { UserSettingsDialogComponent } from "../user-settings/user-settings-dialog/user-settings-dialog.component";
import { Message } from "../shared/message.model";
import { FileUploadDialogComponent } from "./file-upload-dialog/file-upload-dialog.component";
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import { UserService } from "../services/user.service";
import { SnackBarService } from "../services/snack-bar.service";
import { NewRoomDialogComponent } from "./new-room-dialog/new-room-dialog.component";

@Component({
  selector: "app-chat-room",
  templateUrl: "./chat-room.component.html",
  styleUrls: ["./chat-room.component.scss"],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    RouterModule,
    LayoutModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    MatFormFieldModule,
    MatDialogModule,
    MatToolbarModule,
  ],
})
export default class ChatRoomComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly chatService = inject(ChatService);
  private readonly matDialog = inject(MatDialog);
  private readonly roomService = inject(RoomService);
  private readonly router = inject(Router);
  private readonly snackBarService = inject(SnackBarService);
  private readonly userService = inject(UserService);

  protected readonly channels = toSignal(
    from(this.chatService.fetchChannels()),
  );

  protected readonly currentUser = this.authService.currentUser;
  private readonly supabase = this.authService.supabaseClient;

  protected readonly handsetPortrait = toSignal(
    this.breakpointObserver
      .observe(Breakpoints.HandsetPortrait)
      .pipe(map((result) => result.matches)),
  );

  protected readonly messagesError = signal<string>("");
  protected readonly messagesLoading = signal(false);

  protected readonly roomId = input<string>("");
  private readonly roomId$ = toObservable(this.roomId);

  protected readonly extraUserInfo = this.fetchUserInfo();

  private readonly messages$ = this.roomId$.pipe(
    tap(() => {
      this.messagesLoading.set(true);
      this.messagesError.set("");
    }),
    switchMap((roomId) => {
      this.listenToMessages(roomId);
      return this.chatService.fetchMessages(roomId).pipe(
        map((messages) => this.processMessages(messages)),
        catchError((err: unknown) => {
          this.snackBarService.openErrSnackBar(err);
          return of<Message[]>([]);
        }),
      );
    }),
    tap(() => {
      this.messagesLoading.set(false);
    }),
  );

  protected readonly messages = linkedSignal(
    toSignal(this.messages$, {
      initialValue: [],
    }),
  );

  protected readonly textMessageField = new FormControl("");

  protected channel?: RealtimeChannel;

  onLogOut() {
    this.authService.signOut();
    this.router.navigate(["/login"]);
  }

  ngOnDestroy() {
    if (this.channel) {
      this.supabase.removeChannel(this.channel).catch((err: unknown) => {
        console.error(err);
      });
    }
  }

  fetchUserInfo() {
    const userInfoResource = resource({
      loader: () => this.userService.fetchExtraUserInfo(),
    });

    return computed(() => userInfoResource.value());
  }

  onChangeRoom() {
    this.textMessageField.patchValue("");
  }

  onSendMsg() {
    const { value } = this.textMessageField;
    const roomId = this.roomId();

    this.chatService.sendMessage(value, roomId);

    this.textMessageField.patchValue("");
  }

  openCreateRoomDialog() {
    const dialogRef = this.matDialog.open<
      NewRoomDialogComponent,
      undefined,
      string
    >(NewRoomDialogComponent, {
      width: "60vw",
      height: "60vh",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBarService.openSnackBar(`${result} created`);
      }
    });
  }

  openFileUploadDialog() {
    const dialogRef = this.matDialog.open(FileUploadDialogComponent, {
      data: {
        channelId: this.roomId(),
      },
      width: "60vw",
      height: "60vh",
    });
  }

  openUserSettingsDialog() {
    const dialogRef = this.matDialog.open(UserSettingsDialogComponent, {
      width: "60vw",
      height: "60vh",
    });
  }

  private handleDelete(deletedMessage: Partial<Message>) {
    this.messages.update((messages) =>
      messages.filter((message) => message.id !== deletedMessage.id),
    );
  }

  private handleInsert(newMessage: Message) {
    this.messages.update((messages) => {
      // temp NG0955 fix
      if (messages.some((m) => m.id === newMessage.id)) {
        return messages;
      }
      return [...messages, newMessage];
    });
  }

  private handleUpdate(updatedMessage: Message) {
    this.messages.update((messages) =>
      messages.map((message) =>
        message.id === updatedMessage.id ? updatedMessage : message,
      ),
    );
  }

  private handleRealtimeEvent(
    payload: RealtimePostgresChangesPayload<Message>,
  ) {
    switch (payload.eventType) {
      case "INSERT":
        this.handleInsert(payload.new);
        break;
      case "UPDATE":
        this.handleUpdate(payload.new);
        break;
      case "DELETE":
        this.handleDelete(payload.old);
        break;
      default:
        console.warn("Unknown payload event type");
        break;
    }
  }

  private listenToMessages(roomId: string) {
    if (this.channel) {
      this.supabase
        .removeChannel(this.channel)
        .then((res) => {
          this.channel = undefined;
        })
        .catch((err: unknown) => {
          console.error(err);
        });
    }

    this.channel = this.supabase
      .channel(this.roomId())
      .on<Message>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${roomId}`,
        },
        (payload) => {
          this.handleRealtimeEvent(payload);
        },
      )
      .subscribe();
  }

  private processMessages(messages: Message[]) {
    return messages.map((message, i) => ({
      ...message,
      sameSender: i > 0 && message.user_id === messages[i - 1].user_id,
    }));
  }
}
