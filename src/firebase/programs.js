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

export const fetchAllPrograms = async () => {
  const q = query(collection(db, 'purchasablePrograms'));

  try {
    const querySnapshot = await getDocs(q);

    const programs = [];

    querySnapshot.forEach((doc) => {
      programs.push({ ...doc.data(), ref: doc.ref });
    });

    return programs;
  } catch (error) {
    toast.error('Something went wrong while fetching Programs.');
    toast.error(error.message);
    return [];
  }
};

export const ProgramsCollectionSubscriber = (setPrograms) => {
  console.log('Programs subscribing');
  const unsubscribe = onSnapshot(collection(db, 'purchasablePrograms'), (qSnapshot) => {
    const programs = [];
    qSnapshot.docs.forEach((doc) => programs.push({ ...doc.data(), ref: doc.ref }));
    setPrograms(programs);
  });

  return unsubscribe;
};

export const getProgramById = async (id) => {
  const docRef = doc(db, 'purchasablePrograms', id);
  try {
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (error) {
    toast.error('Error in fetching program');
    console.log(error);
    return {};
  }
};

export const updateProgram = async ({
  programId,
  name,
  activeDays,
  price,
  videoUrl,
  description,
}) => {
  activeDays = activeDays.filter((item) => item?.exercises?.length);

  try {
    await updateDoc(doc(db, 'purchasablePrograms', programId), {
      name,
      activeDays,
      price: parseInt(price),
      videoUrl,
      description,
    });
    toast.success('Program updated successfully');
  } catch (error) {
    toast.error(error);
    console.log(error);
  }
};

export const addNewProgram = async ({ name, activeDays, price, videoUrl, description }) => {
  const newProgram = {
    name,
    description,
    price: parseInt(price),
    videoUrl,
  };

  activeDays = activeDays.filter((item) => item?.exercises?.length);

  newProgram.activeDays = activeDays;

  try {
    await addDoc(collection(db, 'purchasablePrograms'), newProgram);
    toast.success('Program created successfully');
  } catch (error) {
    toast.error(error);
    console.log(error);
  }
};
