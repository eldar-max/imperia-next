import {
  collection, doc, addDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy,
  limit, serverTimestamp, onSnapshot,
} from 'firebase/firestore'
import { db } from './firebase'

// ── ЗАКАЗЫ ───────────────────────────────────────────────
export async function createOrder(orderData) {
  const ref = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function getOrder(id) {
  const snap = await getDoc(doc(db, 'orders', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function updateOrderStatus(id, status) {
  await updateDoc(doc(db, 'orders', id), {
    status,
    updatedAt: serverTimestamp(),
  })
}

export function listenOrders(branchId, callback) {
  const q = branchId
    ? query(collection(db, 'orders'), where('branchId', '==', branchId), orderBy('createdAt', 'desc'), limit(50))
    : query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(50))
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

// ── МЕНЮ ─────────────────────────────────────────────────
export async function getMenuItems(category = null) {
  const q = category
    ? query(collection(db, 'menu_items'), where('category', '==', category), where('isActive', '==', true))
    : query(collection(db, 'menu_items'), where('isActive', '==', true))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addMenuItem(data) {
  return await addDoc(collection(db, 'menu_items'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export async function updateMenuItem(id, data) {
  await updateDoc(doc(db, 'menu_items', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteMenuItem(id) {
  await deleteDoc(doc(db, 'menu_items', id))
}

// ── БРОНИРОВАНИЯ ─────────────────────────────────────────
export async function createBooking(data) {
  return await addDoc(collection(db, 'bookings'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  })
}

export async function getBookings(date = null, branchId = null) {
  let q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'))
  if (date)     q = query(q, where('date', '==', date))
  if (branchId) q = query(q, where('branchId', '==', branchId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── АКЦИИ ────────────────────────────────────────────────
export async function getPromotions() {
  const q = query(collection(db, 'promotions'), where('isActive', '==', true))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── ФИЛИАЛЫ ──────────────────────────────────────────────
export async function getBranches() {
  const snap = await getDocs(query(collection(db, 'branches'), where('isActive', '==', true)))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── ФИНАНСЫ ──────────────────────────────────────────────
export async function addTransaction(data) {
  return await addDoc(collection(db, 'transactions'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export async function getTransactions(branchId = null) {
  const q = branchId
    ? query(collection(db, 'transactions'), where('branchId', '==', branchId), orderBy('createdAt', 'desc'))
    : query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(100))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── ОТЗЫВЫ ───────────────────────────────────────────────
export async function addReview(data) {
  return await addDoc(collection(db, 'reviews'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}
