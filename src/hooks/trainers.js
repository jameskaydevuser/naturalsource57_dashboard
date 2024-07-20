import { useEffect, useState } from 'react';
import { fetchAllTrainers, trainersCollectionSubscriber } from 'src/firebase/trainers';

export const useTrainers = () => {
  const [loading, setLoading] = useState(false);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const fetchTrainers = async () => {
      setLoading(true);

      const fetchedTrainers = await fetchAllTrainers();
      setTrainers(fetchedTrainers);

      setLoading(false);
    };

    fetchTrainers();

    const unsubscribe = trainersCollectionSubscriber(setTrainers);

    return () => {
      console.log('trainers unsubscribed');
      unsubscribe();
    };
  }, []);

  return { trainers, loading };
};
