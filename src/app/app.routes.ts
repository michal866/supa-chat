import { Routes } from "@angular/router";
import { UserSettingsDialogComponent } from "./user-settings/user-settings-dialog/user-settings-dialog.component";
import { redirectAuthorizedGuard } from "./guards/redirect-authorized.guard";
import { redirectNotAuthorizedGuard } from "./guards/redirect-not-authorized.guard";

export const routes: Routes = [
  {
    path: "chat",
    redirectTo: "chat/0",
  },
  {
    path: "chat/:roomId",
    loadComponent: () => import("./chat-room/chat-room.component"),
    canActivate: [redirectNotAuthorizedGuard],
    data: {},
  },
  {
    path: "register",
    loadComponent: () => import("./auth/register/register.component"),
    canActivate: [redirectAuthorizedGuard],
    data: {},
  },
  {
    path: "login",
    loadComponent: () => import("./auth/login/login.component"),
    canActivate: [redirectAuthorizedGuard],
    data: {},
  },
  {
    path: "login-help",
    loadComponent: () => import("./auth/login-help/login-help.component"),
    canActivate: [redirectAuthorizedGuard],
    data: {},
  },
  {
    path: "passwordless",
    loadComponent: () => import("./auth/passwordless/passwordless.component"),
    canActivate: [redirectAuthorizedGuard],
    data: {},
  },
  {
    path: "user-pref",
    component: UserSettingsDialogComponent,
    canActivate: [redirectNotAuthorizedGuard],
    data: {},
  },
  { path: "", redirectTo: "/chat", pathMatch: "full" },
  { path: "**", redirectTo: "/chat" },
];
