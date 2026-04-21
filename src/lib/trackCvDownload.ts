import { supabase } from "@/integrations/supabase/client";

/**
 * Light-weight tracking for CV downloads.
 * Sends to the `track-cv-download` edge function which enriches with
 * country (from CF headers) and stores an anonymized hash of the IP.
 */
export async function trackCvDownload(language: string) {
  try {
    await supabase.functions.invoke("track-cv-download", {
      body: {
        language,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      },
    });
  } catch (err) {
    // Silent fail — never block the download
    console.warn("CV download tracking failed:", err);
  }
}
