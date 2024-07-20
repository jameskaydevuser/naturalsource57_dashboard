import { useEffect, useState } from 'react';
import { fetchAllUsers, usersCollectionSubscriber } from 'src/firebase/users';

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      const fetchedUsers = await fetchAllUsers();
      setUsers(fetchedUsers);

      setLoading(false);
    };

    fetchUsers();

    const unsubscribe = usersCollectionSubscriber(setUsers);

    return () => {
      console.log('users unsubscribed');
      unsubscribe();
    };
  }, []);

  return { users, loading };
};
