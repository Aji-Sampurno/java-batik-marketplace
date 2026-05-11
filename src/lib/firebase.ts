import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

const isConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "your_api_key_here" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "your_project_id";

let app;
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

export async function uploadToFirebase(file: File, path: string): Promise<string> {
  if (!storageInstance) {
    throw new Error("Firebase Storage belum dikonfigurasi atau gagal diinisialisasi. Periksa file .env Anda.");
  }
  
  const fileRef = ref(storageInstance, path);
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  await uploadBytes(fileRef, uint8Array, {
    contentType: file.type,
  });
  
  return await getDownloadURL(fileRef);
}
