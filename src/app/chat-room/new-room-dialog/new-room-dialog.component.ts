import { Component, inject } from "@angular/core";
import { FormBuilder, FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import {
  MatDialogContent,
  MatDialogTitle,
  MatDialogActions,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import {
  FileInputDirective,
  FileInputValidators,
  FileInputValue,
} from "@ngx-dropzone/cdk";
import { MatDropzone } from "@ngx-dropzone/material";
import { RoomService } from "../../services/room.service";
import { MatInputModule } from "@angular/material/input";
import { SnackBarService } from "../../services/snack-bar.service";

@Component({
  selector: "app-new-room-dialog",
  imports: [
    // FileInputDirective,
    ReactiveFormsModule,
    MatButtonModule,
    MatChipsModule,
    // MatDropzone,
    MatFormFieldModule,
    MatIconModule,
    // MatLabel,
    // MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatInputModule,
  ],
  templateUrl: "./new-room-dialog.component.html",
  styleUrl: "./new-room-dialog.component.scss",
})
export class NewRoomDialogComponent {
  private readonly roomService = inject(RoomService);
  private readonly dialogRef = inject(MatDialogRef<NewRoomDialogComponent>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBarService = inject(SnackBarService);

  protected readonly newRoomForm = this.formBuilder.group({
    newRoomName: new FormControl(""),
    newRoomImg: new FormControl<FileInputValue>(
      null,
      FileInputValidators.accept("image/*"),
    ),
  });

  onCancelClick() {
    this.dialogRef.close();
  }

  async onCreateRoom() {
    if (this.newRoomForm.invalid) return;

    const { newRoomName, newRoomImg } = this.newRoomForm.value;

    try {
      const newRoom = await this.roomService.createRoom(
        newRoomName,
        newRoomImg,
      );
      this.dialogRef.close(newRoom.slug);
    } catch (err: unknown) {
      this.snackBarService.openSnackBar(
        "Failed to create room. Please try again.",
      );
    }
  }

  removeFile() {
    this.newRoomForm.patchValue({ newRoomImg: null });
  }
}
