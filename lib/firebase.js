import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            || "AIzaSyBh8nmwbZ_k9YKtVlYCMw0MWTfALBXmTSk",
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        || "imperia-pizza-19081.firebaseapp.com",
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         || "imperia-pizza-19081",
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     || "imperia-pizza-19081.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "464484083913",
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             || "1:464484083913:web:076f97bcf0972880044518",
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID     || "G-QGMSDQN7ZK",
}

// Инициализация только один раз
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth    = getAuth(app)
export const db      = getFirestore(app)
export const storage = getStorage(app)

export default app
