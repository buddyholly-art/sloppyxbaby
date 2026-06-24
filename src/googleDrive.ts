import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use Google Auth Provider with full Drive scope to support searching & list manipulations
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/drive");
provider.addScope("https://www.googleapis.com/auth/drive.file");

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth listener
export const initAuth = (
  onAuthSuccess: (user: User, token: string) => void,
  onAuthFailure: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        onAuthSuccess(user, cachedAccessToken);
      } else {
        // If logged in under Firebase but accessToken was refreshed / lost, we need to prompt or re-signInWithPopup
        onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      onAuthFailure();
    }
  });
};

// Sign in with Google Popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to retrieve access token from Google Credentials");
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error("Popup Authentication Error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// ==========================================
// Google Drive API Support Functions
// ==========================================

const DRIVE_FOLDER_NAME = "Obsidian Brain Vault";

export interface DriveFileInfo {
  id: string;
  name: string;
}

/**
 * Find or create the directory "Obsidian Brain Vault" in the user's Google Drive.
 */
export async function findOrCreateAppFolder(token: string): Promise<string> {
  const query = encodeURIComponent(`name = '${DRIVE_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`;
  
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      throw new Error(`Failed to query Google Drive directories. Status: ${res.status}`);
    }
    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }

    // Creating folder if not found
    const createUrl = "https://www.googleapis.com/drive/v3/files";
    const createRes = await fetch(createUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: DRIVE_FOLDER_NAME,
        mimeType: "application/vnd.google-apps.folder"
      })
    });

    if (!createRes.ok) {
      throw new Error(`Failed to create Google Drive vault directory 'Obsidian Brain Vault'. Status: ${createRes.status}`);
    }
    const folderData = await createRes.json();
    return folderData.id;
  } catch (error) {
    console.error("findOrCreateAppFolder failed:", error);
    throw error;
  }
}

/**
 * Convert dynamic memory model to raw markdown with frontmatter metadata.
 */
export function memoryToMarkdown(item: {
  id: string;
  title: string;
  originalInput: string;
  advocatePrompt: string;
  promptScore: number;
  caliberStatus: string;
  shouldSaveAdvisory: string;
  reusabilityTags: string[];
  timestamp: string;
}): string {
  const tagsStr = `[${item.reusabilityTags.join(", ")}]`;
  return `---
id: ${item.id}
title: ${item.title.replace(/"/g, '\\"')}
score: ${item.promptScore}
caliber: ${item.caliberStatus}
tags: ${tagsStr}
timestamp: ${item.timestamp}
originalInput: ${item.originalInput.replace(/"/g, '\\"')}
---

# ${item.title}

## Original Intent
> ${item.originalInput}

## Optimized Specification (Advocate Prompt)
\`\`\`
${item.advocatePrompt}
\`\`\`

## Caliber Save Advisory
💡 ${item.shouldSaveAdvisory}
`;
}

/**
 * Parse Markdown with YAML frontmatter back into Structured SavedPromptMemory format
 */
export function markdownToMemory(mdText: string, fileId: string): any | null {
  try {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = mdText.match(frontmatterRegex);
    if (!match) return null;

    const rawYaml = match[1];
    const bodyContent = match[2];

    const lines = rawYaml.split("\n");
    const fields: Record<string, string> = {};

    lines.forEach(line => {
      const idx = line.indexOf(":");
      if (idx !== -1) {
        const key = line.substring(0, idx).trim();
        const value = line.substring(idx + 1).trim();
        fields[key] = value;
      }
    });

    // Parse specific variables
    const id = fields["id"] || `mem-${Math.random().toString(36).substring(2, 9)}`;
    let title = fields["title"] || "Untitled Prompt";
    if (title.startsWith('"') && title.endsWith('"')) {
      title = title.slice(1, -1);
    }
    title = title.replace(/\\"/g, '"');

    let originalInput = fields["originalInput"] || "";
    if (originalInput.startsWith('"') && originalInput.endsWith('"')) {
      originalInput = originalInput.slice(1, -1);
    }
    originalInput = originalInput.replace(/\\"/g, '"');

    const promptScore = parseInt(fields["score"] || "80", 10);
    const caliberStatus = fields["caliber"] || "exceptional";
    const timestamp = fields["timestamp"] || new Date().toISOString();

    // Parse tag array [Tag1, Tag2]
    let reusabilityTags: string[] = ["General"];
    const tagsRaw = fields["tags"];
    if (tagsRaw) {
      const tagsMatch = tagsRaw.match(/\[(.*?)\]/);
      if (tagsMatch) {
        reusabilityTags = tagsMatch[1]
          .split(",")
          .map(t => t.trim())
          .filter(t => t.length > 0);
      }
    }

    // Extract advocatePrompt from body contents inside ``` codeblock
    let advocatePrompt = "";
    const promptRegex = /## Optimized Specification \(Advocate Prompt\)\r?\n```\r?\n([\s\S]*?)\r?\n```/;
    const promptMatch = bodyContent.match(promptRegex);
    if (promptMatch) {
      advocatePrompt = promptMatch[1];
    } else {
      // Fallback
      advocatePrompt = bodyContent;
    }

    // Extract save advisory
    let shouldSaveAdvisory = "Imported from cloud Obsidian Drive Vault.";
    const advisoryRegex = /## Caliber Save Advisory\r?\n💡 ([\s\S]*)$/;
    const advisoryMatch = bodyContent.match(advisoryRegex);
    if (advisoryMatch) {
      shouldSaveAdvisory = advisoryMatch[1].trim();
    }

    return {
      id,
      title,
      originalInput,
      advocatePrompt,
      promptScore,
      caliberStatus,
      shouldSaveAdvisory,
      reusabilityTags,
      timestamp,
      syncStatus: "✓ Synced & Loaded from Google Drive",
      driveFileId: fileId
    };
  } catch (error) {
    console.error("Failed to parse markdown file format into prompt structure:", error);
    return null;
  }
}

/**
 * Upload prompt memory as a markdown file into the vault folder in Google Drive.
 * Overwrites if there is already a file with the same title to prevent duplication.
 */
export async function uploadPromptFile(
  token: string, 
  folderId: string, 
  memoryItem: {
    id: string;
    title: string;
    originalInput: string;
    advocatePrompt: string;
    promptScore: number;
    caliberStatus: string;
    shouldSaveAdvisory: string;
    reusabilityTags: string[];
    timestamp: string;
  }
): Promise<{ success: boolean; fileId: string }> {
  const fileName = `${memoryItem.title.replace(/[/\\?%*:|"<>\s]+/g, "_")}.md`;
  const markdownText = memoryToMarkdown(memoryItem);

  try {
    // 1. Search if the file already exists in this folder to allow simple patching updates
    const query = encodeURIComponent(`name = '${fileName}' and '${folderId}' in parents and trashed = false`);
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    let existingFileId: string | null = null;
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        existingFileId = searchData.files[0].id;
      }
    }

    if (existingFileId) {
      // Overwrite file content using PATCH /upload endpoint
      const updateContentUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`;
      const updateRes = await fetch(updateContentUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/markdown"
        },
        body: markdownText
      });

      if (!updateRes.ok) {
        throw new Error(`Failed to update file contents on Google Drive. Status: ${updateRes.status}`);
      }

      // Also update some metadata to keep Modified time fresh
      await fetch(`https://www.googleapis.com/drive/v3/files/${existingFileId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          modifiedTime: new Date().toISOString()
        })
      });

      return { success: true, fileId: existingFileId };
    } else {
      // Create new file
      // Step A: Create Metadata
      const createMetaUrl = "https://www.googleapis.com/drive/v3/files";
      const metaRes = await fetch(createMetaUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: fileName,
          mimeType: "text/markdown",
          parents: [folderId]
        })
      });

      if (!metaRes.ok) {
        throw new Error(`Failed to initialize Google Drive file metadata. Status: ${metaRes.status}`);
      }
      const fileMeta = await metaRes.json();
      const newFileId = fileMeta.id;

      // Step B: Upload file text context
      const uploadMediaUrl = `https://www.googleapis.com/upload/drive/v3/files/${newFileId}?uploadType=media`;
      const uploadRes = await fetch(uploadMediaUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/markdown"
        },
        body: markdownText
      });

      if (!uploadRes.ok) {
        throw new Error(`Failed to write file contents of markdown on Google Drive. Status: ${uploadRes.status}`);
      }

      return { success: true, fileId: newFileId };
    }
  } catch (error) {
    console.error("uploadPromptFile Error:", error);
    throw error;
  }
}

/**
 * Downloads all markdown memories stored inside the user's Obsidian Vault folder.
 */
export async function downloadAllVaultFiles(token: string, folderId: string): Promise<any[]> {
  const query = encodeURIComponent(`'${folderId}' in parents and mimeType = 'text/markdown' and trashed = false`);
  const listUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&pageSize=100`;

  try {
    const res = await fetch(listUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      throw new Error(`Failed to download files listing. Status: ${res.status}`);
    }
    const data = await res.json();
    const files = data.files || [];

    const parsedMemories: any[] = [];

    // Download content for each file
    for (const file of files) {
      try {
        const contentUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
        const contentRes = await fetch(contentUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (contentRes.ok) {
          const text = await contentRes.text();
          const parsed = markdownToMemory(text, file.id);
          if (parsed) {
            parsedMemories.push(parsed);
          }
        }
      } catch (err) {
        console.error(`Failed to download or parse index file '${file.name}':`, err);
      }
    }

    return parsedMemories;
  } catch (error) {
    console.error("downloadAllVaultFiles error:", error);
    throw error;
  }
}

/**
 * Delete a memory markdown file from the user's Obsidian Vault on Google Drive.
 */
export async function deleteVaultFile(token: string, fileId: string): Promise<boolean> {
  try {
    const deleteUrl = `https://www.googleapis.com/drive/v3/files/${fileId}`;
    const res = await fetch(deleteUrl, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  } catch (error) {
    console.error("deleteVaultFile error:", error);
    return false;
  }
}
