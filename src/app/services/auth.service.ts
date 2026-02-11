import { computed, Injectable, signal } from "@angular/core";
import { Session } from "@supabase/supabase-js";
import { redirects, supabase } from "../../environments/environment.dev";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  readonly currentSession = computed(() => this.sessionState());

  readonly currentUser = computed(() => this.sessionState()?.user);

  readonly supabaseClient = supabase;

  private readonly sessionState = signal<Session | null>(null);

  constructor() {
    this.authChangesSub();
  }

  authChangesSub() {
    this.supabaseClient.auth.onAuthStateChange((_, session) => {
      this.sessionState.set(session);
    });
  }
  async sendPasswordResetEmail(email: string) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirects.passwordReset,
    });
  }

  signInWithEmail(email: string) {
    return this.supabaseClient.auth.signInWithOtp({ email });
  }

  signInWithPassword(email: string, password: string) {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  signOut() {
    return this.supabaseClient.auth.signOut();
  }

  signUpWithPassword(email: string, password: string, username: string) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: username },
        emailRedirectTo: redirects.afterSignUp,
      },
    });
  }
}
