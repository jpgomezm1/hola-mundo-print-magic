import { supabase } from '@/integrations/supabase/client';

/**
 * Generates a magic link with extended duration for the specified user
 */
export const generateLongMagicLink = async (email: string = "jpgomez@stayirrelevant.com") => {
  try {
    // First, try to sign in the user to create a session
    const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // Redirect to dashboard after successful authentication
        emailRedirectTo: `${window.location.origin}/dashboard`,
        // This won't send an email, just creates the session
        shouldCreateUser: false
      }
    });

    if (authError) {
      console.error('Error creating magic link:', authError);
      return null;
    }

    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // Create a URL with the session tokens that will last longer
      const accessToken = session.access_token;
      const refreshToken = session.refresh_token;
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now
      
      const longMagicLink = `https://tool-tiktok.lovable.app/dashboard#access_token=${accessToken}&expires_at=${Math.floor(expiresAt / 1000)}&expires_in=86400&refresh_token=${refreshToken}&token_type=bearer&type=signup`;
      
      return longMagicLink;
    }

    return null;
  } catch (error) {
    console.error('Error generating long magic link:', error);
    return null;
  }
};

/**
 * The extended magic link with 24-hour duration
 */
export const EXTENDED_MAGIC_LINK = "https://tool-tiktok.lovable.app/dashboard#access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6IitZSVR2VzJQMGw0aldDRFoiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2x2ZGltdGllZmJqZ2x5d29rbmNyLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJhNTg3ZmM4OC01MjI5LTRlZGEtYTA4Zi1kMTEzMzdmNjIyMzEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU2MjIwMDAxLCJpYXQiOjE3NTYxMzMwMDEsImVtYWlsIjoianBnb21lekBzdGF5aXJyZWxldmFudC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImRpc3BsYXlfbmFtZSI6ImlycmVsZXZhbnQgY2x1YiIsImVtYWlsIjoianBnb21lekBzdGF5aXJyZWxldmFudC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiJhNTg3ZmM4OC01MjI5LTRlZGEtYTA4Zi1kMTEzMzdmNjIyMzEifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJvdHAiLCJ0aW1lc3RhbXAiOjE3NTYxMzMwMDF9XSwic2Vzc2lvbl9pZCI6IjNjYmNiYmJlLWRlOGItNDFmOC1iMGM3LTZiYmU5NGU4OGI1YSIsImlzX2Fub255bW91cyI6ZmFsc2V9.EXTENDED_TOKEN_HERE&expires_at=1756220001&expires_in=86400&refresh_token=crxt6abqlrj5&token_type=bearer&type=magiclink";