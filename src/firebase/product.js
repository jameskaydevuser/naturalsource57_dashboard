import {
  addDoc,
  collection,
  doc,
  getDoc, 
  getDocs,
  onSnapshot,
  deleteDoc,
  query,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '.';
import { toast } from 'react-toastify';

export const fetchAllProducts = async (categoryId) => {
  const q = query(collection(db, 'products'), where('information.category', '==', categoryId));

  try {
    const querySnapshot = await getDocs(q);

    const products = [];

    querySnapshot.forEach((doc) => {
      products.push({ ...doc.data(), ref: doc.ref });
    });

    return products;
  } catch (error) {
    toast.error('Something went wrong while fetching Products.');
    toast.error(error.message);
    return [];
  }
};

export const ProductsCollectionSubscriber = (setProducts) => {
  console.log('Products subscribing');
  const unsubscribe = onSnapshot(collection(db, 'purchasableProducts'), (qSnapshot) => {
    const products = [];
    qSnapshot.docs.forEach((doc) => products.push({ ...doc.data(), ref: doc.ref }));
    setProducts(products);
  });

  return unsubscribe;
};

export const getProductById = async (id) => {
  const docRef = doc(db, 'products', id);
  try {
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (error) {
    toast.error('Error in fetching product');
    console.log(error);
    return {};
  }
};

export const updateProduct = async ({
  productId,
  name,
  description,
  price,
  thc,
  cbd,
  quantity,
  shipping_fee,
  imageUrl,
  category,
}) => {

  const newProduct = {
    information: {
      name,
      description,
      category,
      imageUrl,
      thc,
      cbd
    },
    price: {
      price,
    },
    quantity,
    shipping_fee,
  };
  try {
    await updateDoc(doc(db, 'products', productId), newProduct);
    toast.success('Product updated successfully');
    // window.location.reload();
  } catch (error) {
    toast.error(error);
    console.log(error);
  }
};

export const addNewProduct = async ({
  name,
  description,
  price,
  quantity,
  thc,
  cbd,
  shipping_fee,
  imageUrl,
  category,
}) => {
  const newProduct = {
    information: {
      name,
      description,
      category,
      imageUrl,
      thc,
      cbd
    },
    price: {
      price,
    },
    quantity,
    shipping_fee,
  };

  try {
    await addDoc(collection(db, 'products'), newProduct);
    toast.success('Product created successfully');
  } catch (error) {
    toast.error(error);
    console.log(error);
  }

  window.location.reload();
};

export const deleteDocByRef = async (docRef) => {
  await deleteDoc(docRef);
  window.location.reload();
};
