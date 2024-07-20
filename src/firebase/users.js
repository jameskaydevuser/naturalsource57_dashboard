import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '.';
import { toast } from 'react-toastify';
import { capitalizeSentence } from 'src/utils/capitalizeSentence';
import axios from 'axios';
import { getIdToken } from '@firebase/auth';


export const fetchUser = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (ex) {
    toast.error(ex.message);
    return null;
  }
};

export const fetchAllUsers = async () => {
  const q = query(collection(db, 'users'));
  try {
    const querySnapshot = await getDocs(q);

    const users = [];

    querySnapshot.forEach((doc) => {
      users.push({ ...doc.data(), ref: doc.ref });
    });
    return users;
  } catch (error) {
    toast.error('Something went wrong while fetching users.');
    toast.error(error.message);
    return [];
  }
};

export const usersCollectionSubscriber = (setUsers) => {
  console.log('Users subscribing');
  const unsubscribe = onSnapshot(collection(db, 'users'), (qSnapshot) => {
    const users = [];
    qSnapshot.docs.forEach((doc) => users.push({ ...doc.data(), ref: doc.ref }));
    setUsers(users);
  });

  return unsubscribe;
};

export const updateUser = async ({
  user,
  firstname,
  lastname,
  job_title,
  phone_number,
  address,
  profile_img,
  is_contactable,
}) => {
  const userDoc = doc(db, 'users', user.uid);

  await updateDoc(userDoc, {
    firstname,
    lastname,
    job_title,
    phone_number,
    address,
    profile_img,
    is_contactable: Boolean(is_contactable),
    display_name: capitalizeSentence(`${firstname} ${lastname}`),
  });
};

export const createUser = async ({
  user,
  firstname,
  lastname,
  email,
  job_title,
  phone_number,
  address,
  is_contactable,
  profile_img
}) => {

  const url = 'https://europe-west2-ikm-intel-555.cloudfunctions.net/createUser';

  const token = await user.getIdToken();

  await axios.post(url, {
    firstname, lastname, email, job_title, phone_number, address, is_contactable: Boolean(is_contactable), profile_img
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

}

export const deleteDocByRef = async (docRef) => {
  await deleteDoc(docRef);
};

export const getClientsOfTrainer = async (trainerRef) => {
  const q = query(collection(db, 'users'), where('trainerRef', '==', trainerRef));
  const qSnapshot = await getDocs(q);

  const clients = [];
  if (!qSnapshot.empty) {
    qSnapshot.docs.forEach((doc) => clients.push(doc.data()));
  }

  return clients;
};


export const updateUserSignupStatus = async (uid, status) => {
  console.log('Approving user with UID:', uid);
  const userDoc = doc(db, 'users', uid);

  try {
    await updateDoc(userDoc, {
      isApproved: status
    });
    toast.success('User status updated successfully');
  } catch (error) {
    toast.error('Error updating user status');
    toast.error(error.message);
  }
};