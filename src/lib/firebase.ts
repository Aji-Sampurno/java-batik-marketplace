import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function getEnv(key: string, fallback: string = ""): string {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return fallback;
}

function getFirebaseConfig() {
  const apiKey = getEnv("PUBLIC_FIREBASE_API_KEY");
  const authDomain = getEnv("PUBLIC_FIREBASE_AUTH_DOMAIN");
  const projectId = getEnv("PUBLIC_FIREBASE_PROJECT_ID");
  const rawBucket = getEnv("PUBLIC_FIREBASE_STORAGE_BUCKET");
  const messagingSenderId = getEnv("PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
  const appId = getEnv("PUBLIC_FIREBASE_APP_ID");

  let defaultBucket = rawBucket;
  if (defaultBucket && !defaultBucket.includes(".")) {
    defaultBucket = defaultBucket.trim();
  }

  const isConfigured = 
    Boolean(apiKey) && 
    apiKey !== "your_api_key_here" &&
    Boolean(projectId) &&
    projectId !== "your_project_id";

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: defaultBucket,
    rawBucket,
    messagingSenderId,
    appId,
    isConfigured
  };
}

function getFirebaseApp() {
  const config = getFirebaseConfig();
  if (!config.isConfigured) {
    return null;
  }
  try {
    return getApps().length === 0 ? initializeApp(config) : getApp();
  } catch (e: any) {
    console.error("Firebase Storage failed to initialize:", e.message);
    return null;
  }
}

export const storage = (() => {
  const app = getFirebaseApp();
  return app ? getStorage(app) : null;
})();

export async function uploadToFirebase(file: File, path: string, customBucket?: string): Promise<string> {
  const config = getFirebaseConfig();
  const app = getFirebaseApp();

  if (!config.isConfigured || !app) {
    throw new Error("Firebase Storage belum dikonfigurasi di Environment Variables Production. Pastikan PUBLIC_FIREBASE_API_KEY dan PUBLIC_FIREBASE_PROJECT_ID sudah diinput di dashboard hosting / file .env server.");
  }

  const projectId = config.projectId;
  const rawBucket = config.rawBucket;

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

  throw lastError || new Error("Semua percobaan upload ke bucket Firebase gagal.");
}
