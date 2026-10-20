import { supabaseBrowser } from "@/lib/supabase/browser";

const BUCKET = "incident-evidence";

export async function uploadEvidenceFile(
  reportId: number,
  file: File
) {
  const response = await fetch(
    `/api/reports/${reportId}/evidence/sign-upload`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Could not authorize upload.");
  }

  const { error } = await supabaseBrowser.storage
    .from(BUCKET)
    .uploadToSignedUrl(result.path, result.token, file, {
      contentType: file.type || "application/octet-stream",
    });

  if (error) {
    throw new Error(error.message);
  }

  return {
    name: file.name,
    size: file.size,
    type: file.type || "application/octet-stream",
    path: result.path,
  };
}
