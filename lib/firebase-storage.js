import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

// Загрузить фото блюда
export async function uploadMenuImage(file, itemId) {
  const storageRef = ref(storage, `menu/${itemId}_${Date.now()}_${file.name}`)
  const snap = await uploadBytes(storageRef, file)
  return await getDownloadURL(snap.ref)
}

// Загрузить аватар пользователя
export async function uploadAvatar(file, userId) {
  const storageRef = ref(storage, `avatars/${userId}_${Date.now()}`)
  const snap = await uploadBytes(storageRef, file)
  return await getDownloadURL(snap.ref)
}

// Загрузить фото акции
export async function uploadPromoImage(file, promoId) {
  const storageRef = ref(storage, `promotions/${promoId}_${Date.now()}_${file.name}`)
  const snap = await uploadBytes(storageRef, file)
  return await getDownloadURL(snap.ref)
}

// Удалить файл по URL
export async function deleteFile(url) {
  try {
    const fileRef = ref(storage, url)
    await deleteObject(fileRef)
  } catch (e) {
    console.error('Ошибка удаления файла:', e)
  }
}
