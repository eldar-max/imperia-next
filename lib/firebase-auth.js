import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

const googleProvider = new GoogleAuthProvider()

// ── Регистрация ──────────────────────────────────────────
export async function registerUser({ name, email, password, phone }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName: name })

  // Сохраняем в Firestore
  await setDoc(doc(db, 'users', cred.user.uid), {
    uid:       cred.user.uid,
    name,
    email,
    phone:     phone || '',
    role:      'customer',
    createdAt: serverTimestamp(),
  })

  return cred.user
}

// ── Вход ─────────────────────────────────────────────────
export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

// ── Вход через Google ─────────────────────────────────────
export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider)
  const user = cred.user

  // Создаём документ если первый вход
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      uid:       user.uid,
      name:      user.displayName || '',
      email:     user.email || '',
      phone:     user.phoneNumber || '',
      avatar:    user.photoURL || '',
      role:      'customer',
      createdAt: serverTimestamp(),
    })
  }
  return user
}

// ── Выход ─────────────────────────────────────────────────
export async function logoutUser() {
  await signOut(auth)
}

// ── Получить профиль из Firestore ─────────────────────────
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

// ── Слушатель состояния ───────────────────────────────────
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}

// ── Забыл пароль — отправить письмо ──────────────────────
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email, {
    url: 'http://localhost:3000/login', // После сброса вернётся на логин
  })
}

// ── Изменить пароль (зная старый) ─────────────────────────
export async function changePassword(currentPassword, newPassword) {
  const user = auth.currentUser
  if (!user) throw new Error('Не авторизован')

  // Повторная аутентификация для безопасности
  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)

  // Меняем пароль
  await updatePassword(user, newPassword)
}
