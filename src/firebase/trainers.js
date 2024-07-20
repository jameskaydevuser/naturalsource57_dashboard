import { collection, getDocs, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { db } from '.';

export const fetchAllTrainers = async () => {
  const q = query(collection(db, 'trainers'));

  try {
    const querySnapshot = await getDocs(q);

    const trainers = [];

    querySnapshot.forEach((doc) => {
      trainers.push({ ...doc.data(), ref: doc.ref });
    });

    return trainers;
  } catch (error) {
    toast.error('Something went wrong while fetching trainers.');
    toast.error(error.message);
    return [];
  }
};

export const trainersCollectionSubscriber = (setTrainers) => {
  console.log('Trainers subscribing');
  const unsubscribe = onSnapshot(collection(db, 'trainers'), (qSnapshot) => {
    const trainers = [];
    qSnapshot.docs.forEach((doc) => trainers.push({ ...doc.data(), ref: doc.ref }));
    setTrainers(trainers);
  });

  return unsubscribe;
};

export const updateTrainerCertificates = async (trainerRef, certificates) => {
  await updateDoc(trainerRef, {
    certificates: certificates,
  });
};
