import { onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from 'src/firebase';
import { fetchUser } from 'src/firebase/users';

export const useAuth = () => {
  const [user, setUser] = useState();

  const unsubscribe = () =>
    onAuthStateChanged(auth, async (newUserState) => {
      if (newUserState) {
        const result = await fetchUser(newUserState.uid);

        if (result?.is_admin) {
          setUser(result);
        } else {
          auth.signOut();
          toast.error('Only admin account can use dashboard');
          setUser(null);
        }
      } else {
        setUser(newUserState);
      }
    });

  return {
    unsubscriberAuth: unsubscribe,
    user,
  };
};
