import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from './index';

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (ex) {
    toast.error(ex.message);
    return null;
  }
};
