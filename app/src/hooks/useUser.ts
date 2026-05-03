import { useState, useEffect } from "react";
import { createClient } from "@/src/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export interface LimitedUser {
  user_id: string;
  email: string | undefined;
  display_name: string | undefined;
}

export function useUser() {
  const [user, setUser] = useState<LimitedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({
          user_id: user.id,
          email: user.email,
          display_name: user.user_metadata?.display_name,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
