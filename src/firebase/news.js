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

export const fetchAllNews = async () => {
    const q = query(collection(db, 'news'));

    try {
        const querySnapshot = await getDocs(q);

        const news = [];

        querySnapshot.forEach((doc) => {
            news.push({ ...doc.data(), ref: doc.ref });
        });

        return news;
    } catch (error) {
        toast.error('Something went wrong while fetching news.');
        toast.error(error.message);
        return [];
    }
};

export const NewsCollectionSubscriber = (setNews) => {
    console.log('News subscribing');
    const unsubscribe = onSnapshot(collection(db, 'news'), (qSnapshot) => {
        const news = [];
        qSnapshot.docs.forEach((doc) => news.push({ ...doc.data(), ref: doc.ref }));
        setNews(news);
    });

    return unsubscribe;
};

export const getNewsById = async (id) => {
    const docRef = doc(db, 'news', id);
    try {
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    } catch (error) {
        toast.error('Error in fetching news');
        console.log(error);
        return null;
    }
};

export const updateNews = async ({
    newsId,
    title,
    author,
    content,
    image_url,
}) => {
    try {
        await updateDoc(doc(db, 'news', newsId), {
            title,
            author,
            content,
            image_url
        });
        toast.success('News updated successfully');
    } catch (error) {
        toast.error(error);
        console.log(error);
    }
};

export const addNewNews = async ({ title, author, publish_date, pdf_url, content, image_url, pdf_title }) => {
    const newNews = {
        title, author, publish_date, pdf_url, content, image_url, pdf_title
    };

    try {
        await addDoc(collection(db, 'news'), newNews);
        toast.success('News created successfully');
    } catch (error) {
        toast.error(error);
        console.log(error);
    }
};
