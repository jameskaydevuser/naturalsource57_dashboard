import { useEffect, useState } from 'react';
import { ExercisesCollectionSubscriber, fetchAllExercises } from 'src/firebase/exercises';

export const useExercises = () => {
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);

      const fetchedExercises = await fetchAllExercises();
      setExercises(fetchedExercises);

      setLoading(false);
    };

    fetchExercises();

    const unsubscribe = ExercisesCollectionSubscriber(setExercises);

    return () => {
      console.log('exercises unsubscribed');
      unsubscribe();
    };
  }, []);

  return { exercises, loading };
};
