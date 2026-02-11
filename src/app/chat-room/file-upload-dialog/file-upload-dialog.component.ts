import { Component, inject } from "@angular/core";
import { FileInputDirective } from "@ngx-dropzone/cdk";
import { MatChipsModule } from "@angular/material/chips";
import { MatDropzone } from "@ngx-dropzone/material";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { ChatService } from "../../services/chat.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SnackBarService } from "../../services/snack-bar.service";

@Component({
  selector: "app-file-upload-dialog",
  imports: [
    FileInputDirective,
    ReactiveFormsModule,
    MatButtonModule,
    MatChipsModule,
    MatDropzone,
    MatFormFieldModule,
    MatIconModule,
    MatLabel,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
  ],
  templateUrl: "./file-upload-dialog.component.html",
  styleUrl: "./file-upload-dialog.component.scss",
})
export class FileUploadDialogComponent {
  private readonly chatService = inject(ChatService);
  private readonly dialogData = inject<{
    channelId: string;
  }>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<FileUploadDialogComponent>);

  protected readonly fileUploadCtrl = new FormControl<File[]>([]);

  onCancelClick() {
    this.dialogRef.close();
  }

  async sendFiles() {
    const uploadPromises = this.chatService.uploadFile(
      this.fileUploadCtrl.value,
      this.dialogData.channelId,
    );

    if (uploadPromises) {
      const uploadResponses = await Promise.all(uploadPromises);

      const [{ error }] = uploadResponses;

      // TODO: move this loop to chat service
      for (const response of uploadResponses) {
        if (response.data) {
          this.chatService
            .sendFileMessage(response.data.fullPath, this.dialogData.channelId)
            .catch((error: unknown) => {
              console.error(error);
              // this.snackBarService.openErrSnackBar(error);
            });
        }
      }
    }
  }

  removeFile(fileIndex: number) {
    this.fileUploadCtrl.value?.splice(fileIndex, 1);
  }
}
