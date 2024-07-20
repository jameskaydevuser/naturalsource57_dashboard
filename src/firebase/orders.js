import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
} from 'firebase/firestore';
import { db } from '.';
import { toast } from 'react-toastify';

export const fetchAllOrders = async () => {
  const q = query(collection(db, 'orders'));

  try {
    const querySnapshot = await getDocs(q);

    const orders = [];

    querySnapshot.forEach((doc) => {
      orders.push({ ...doc.data(), ref: doc.ref });
    });

    return orders;
  } catch (error) {
    toast.error('Something went wrong while fetching orders.');
    toast.error(error.message);
    return [];
  }
};

// export const NewsCollectionSubscriber = (setNews) => {
//   console.log('News subscribing');
//   const unsubscribe = onSnapshot(collection(db, 'news'), (qSnapshot) => {
//       const news = [];
//       qSnapshot.docs.forEach((doc) => news.push({ ...doc.data(), ref: doc.ref }));
//       setNews(news);
//   });

//   return unsubscribe;
// };

export const getOrdersById = async (id) => {
  const docRef = doc(db, 'orders', id);
  try {
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (error) {
    toast.error('Error in fetching orders');
    console.log(error);
    return null;
  }
};

export const updateOrders = async ({ orderId, title, author, content, image_url }) => {
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      title,
      author,
      content,
      image_url,
    });
    toast.success('Orders updated successfully');
  } catch (error) {
    toast.error(error);
    console.log(error);
  }
};

export const updateOrderStatus = async ({ orderId, status }) => {
  console.log(orderId)
  console.log(status)
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status
    });
    toast.success('Orders updated successfully');
  } catch (error) {
    toast.error(error);
    console.log(error);
  }
};

export const addNewOrders = async ({
  title,
  author,
  publish_date,
  pdf_url,
  content,
  image_url,
  pdf_title,
}) => {
  const newOrders = {
    title,
    author,
    publish_date,
    pdf_url,
    content,
    image_url,
    pdf_title,
  };

  try {
    await addDoc(collection(db, 'orders'), newOrders);
    toast.success('Orders created successfully');
  } catch (error) {
    toast.error(error);
    console.log(error);
  }
};
