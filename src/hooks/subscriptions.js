import { useEffect, useState } from 'react';
import {
  SubscriptionsCollectionSubscriber,
  fetchAllSubscriptions,
} from 'src/firebase/subscriptions';

export const useSubscriptions = () => {
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);

      const fetchedSubscriptions = await fetchAllSubscriptions();
      setSubscriptions(fetchedSubscriptions);

      setLoading(false);
    };

    fetchSubscriptions();

    const unsubscribe = SubscriptionsCollectionSubscriber(setSubscriptions);

    return () => {
      console.log('subscriptions unsubscribed');
      unsubscribe();
    };
  }, []);

  return { subscriptions, loading };
};
