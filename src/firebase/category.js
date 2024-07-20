import { db, storage } from '.';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const fetchCategoryName = async (categoryId) => {
  const docRef = doc(db, 'categories', categoryId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.name;
  } else {
    return null;
  }
};

export const fetchCategory = async (categoryId) => {
  const docRef = doc(db, 'categories', categoryId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateCategory = async (categoryId, updates) => {
  const docRef = doc(db, 'categories', categoryId);
  await updateDoc(docRef, updates);
};

export const uploadImage = async (file, path) => {
  const storageRef = ref(storage, `${path}/${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};
