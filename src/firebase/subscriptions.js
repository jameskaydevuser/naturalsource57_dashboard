import { collection, getDocs, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { db } from '.';
import { planAvailableClients } from 'src/config/planInfo';

export const fetchAllSubscriptions = async () => {
  const q = query(collection(db, 'subscriptions'));

  try {
    const querySnapshot = await getDocs(q);

    const subscriptions = [];

    querySnapshot.forEach((doc) => {
      subscriptions.push({ ...doc.data(), ref: doc.ref });
    });

    return subscriptions;
  } catch (error) {
    toast.error('Something went wrong while fetching Subscriptions.');
    toast.error(error.message);
    return [];
  }
};

export const SubscriptionsCollectionSubscriber = (setSubscriptions) => {
  console.log('Subscriptions subscribing');
  const unsubscribe = onSnapshot(collection(db, 'subscriptions'), (qSnapshot) => {
    const subscriptions = [];
    qSnapshot.docs.forEach((doc) => subscriptions.push({ ...doc.data(), ref: doc.ref }));
    setSubscriptions(subscriptions);
  });

  return unsubscribe;
};

export const updatePlanTypeOfSubscription = async (subRef, planType) => {
  await updateDoc(subRef, {
    'moreInfo.type': planType,
    'moreInfo.capacity': planAvailableClients[planType],
  });
};
