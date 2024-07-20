import { useEffect, useState } from 'react';
import { ProgramsCollectionSubscriber, fetchAllPrograms } from 'src/firebase/programs';

export const usePrograms = () => {
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);

      const fetchedPrograms = await fetchAllPrograms();
      setPrograms(fetchedPrograms);

      setLoading(false);
    };

    fetchPrograms();

    const unsubscribe = ProgramsCollectionSubscriber(setPrograms);

    return () => {
      console.log('programs unsubscribed');
      unsubscribe();
    };
  }, []);

  return { programs, loading };
};
