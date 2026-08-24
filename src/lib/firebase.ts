import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const rawBucket = import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || "";
const projectId = import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || "";

// Normalize default bucket name if needed
let defaultBucket = rawBucket;
if (defaultBucket && !defaultBucket.includes(".")) {
  // If bucket is e.g. "katalog-batik" or without domain, prepare candidates
  defaultBucket = defaultBucket.trim();
}

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: projectId,
  storageBucket: defaultBucket,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

const isConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "your_api_key_here" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "your_project_id";

let app: any = null;
let storageInstance: any = null;

if (isConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    storageInstance = getStorage(app);
  } catch (e: any) {
    console.error("Firebase Storage failed to initialize:", e.message);
  }
}

export const storage = storageInstance;

export async function uploadToFirebase(file: File, path: string, customBucket?: string): Promise<string> {
  if (!isConfigured || !app) {
    throw new Error("Firebase Storage belum dikonfigurasi atau gagal diinisialisasi. Periksa file .env Anda.");
  }

  // Generate bucket candidates to try
  const candidates: string[] = [];
  if (customBucket && customBucket.trim()) {
    candidates.push(customBucket.trim());
  }
  if (rawBucket && rawBucket.trim()) {
    candidates.push(rawBucket.trim());
    if (!rawBucket.includes(".")) {
      candidates.push(`${rawBucket.trim()}.appspot.com`);
      candidates.push(`${rawBucket.trim()}.firebasestorage.app`);
    }
  }
  if (projectId && projectId.trim()) {
    candidates.push(`${projectId.trim()}.firebasestorage.app`);
    candidates.push(`${projectId.trim()}.appspot.com`);
  }

  const uniqueCandidates = [...new Set(candidates.filter(Boolean))];
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  let lastError: any = null;

  for (const bucket of uniqueCandidates) {
    try {
      // Determine storage bucket instance
      let currentStorage: any;
      if (bucket.startsWith("gs://")) {
        currentStorage = getStorage(app, bucket);
      } else if (bucket.includes(".")) {
        currentStorage = getStorage(app, `gs://${bucket}`);
      } else {
        currentStorage = getStorage(app);
      }

      const fileRef = ref(currentStorage, path);
      await uploadBytes(fileRef, uint8Array, {
        contentType: file.type,
      });

      const downloadUrl = await getDownloadURL(fileRef);
      console.log(`[Firebase Upload Success] Bucket: ${bucket} -> URL: ${downloadUrl}`);
      return downloadUrl;
    } catch (err: any) {
      lastError = err;
      console.warn(`[Firebase Upload Failed with bucket ${bucket}]:`, err.message || err);
    }
  }

  throw lastError || new Error("Semua percobaan bucket Firebase gagal.");
}
