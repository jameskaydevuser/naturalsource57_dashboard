import { addDoc, collection, getDocs, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { db } from '.';

export const fetchAllExercises = async () => {
  const q = query(collection(db, 'exercises'));

  try {
    const querySnapshot = await getDocs(q);

    const exercises = [];

    querySnapshot.forEach((doc) => {
      exercises.push({ ...doc.data(), ref: doc.ref });
    });

    return exercises;
  } catch (error) {
    toast.error('Something went wrong while fetching Exercises.');
    toast.error(error.message);
    return [];
  }
};

export const ExercisesCollectionSubscriber = (setExercises) => {
  console.log('Exercises subscribing');
  const unsubscribe = onSnapshot(collection(db, 'exercises'), (qSnapshot) => {
    const exercises = [];
    qSnapshot.docs.forEach((doc) => exercises.push({ ...doc.data(), ref: doc.ref }));
    setExercises(exercises);
  });

  return unsubscribe;
};

export const updateExercise = async (
  exerciseRef,
  name,
  description,
  type,
  videoUrl,
  targetMuscle,
  implement,
  imageUrl,
) => {
  await updateDoc(exerciseRef, {
    name,
    description,
    type,
    videoUrl,
    targetMuscle,
    implement,
    imageUrl
  });
};

export const addNewExercise = async (
  name,
  description,
  type,
  videoUrl,
  targetMuscle,
  implement,
  imageUrl,
) => {
  const newExercise = {
    name,
    description,
    type,
    videoUrl,
    targetMuscle,
    implement,
    imageUrl,
  };

  await addDoc(collection(db, 'exercises'), newExercise);
};
