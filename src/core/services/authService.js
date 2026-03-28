import { supabase } from "./supabaseClient";

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