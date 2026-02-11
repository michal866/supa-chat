import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const redirectNotAuthorizedGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const { data } = await authService.supabaseClient.auth.getSession();

  if (data.session) {
    return true;
  } else {
    return router.parseUrl("/login");
  }
};
