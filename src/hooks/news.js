import { useEffect, useState } from 'react';
import { NewsCollectionSubscriber, fetchAllNews } from 'src/firebase/news';

export const useNews = () => {
    const [loading, setLoading] = useState(false);
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);

            const fetchedNews = await fetchAllNews();
            setNews(fetchedNews);

            setLoading(false);
        };

        fetchNews();

        const unsubscribe = NewsCollectionSubscriber(setNews);

        return () => {
            console.log('news unsubscribed');
            unsubscribe();
        };
    }, []);

    return { news, loading };
};
