import { supabase } from "./supabaseClient";
import { getPasswordResetRedirectUrl } from "../utils/authRedirect.js";

export const authService = {

  async signUp(username, email, password) {

    try {

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      });

      if (error) {
        console.error("Signup error:", error);
        return { user: null, error };
      }

      return { user: data.user, error: null };

    } catch (error) {

      console.error("Signup exception:", error);
      return { user: null, error };

    }
  },


  async signIn(email, password) {

    try {

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { user: null, error };
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile error:", profileError);
      }

      return {
        user: {
          ...data.user,
          profile: profile
        },
        error: null
      };

    } catch (error) {

      return { user: null, error };

    }
  },


  async signOut() {

    const { error } = await supabase.auth.signOut();
    return { error };

  },

  /**
   * Demande un email de réinitialisation (flux officiel Supabase).
   * redirectTo doit être autorisé dans Supabase → Authentication → URL Configuration → Redirect URLs.
   */
  async requestPasswordReset(email) {
    const redirectTo = getPasswordResetRedirectUrl();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });
    return { error };
  },

  /** À appeler sur la page dédiée, une fois la session « recovery » établie (lien email). */
  async updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  },


  async getCurrentUser() {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    return {
      ...user,
      profile
    };

  }

};