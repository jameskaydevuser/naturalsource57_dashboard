import { Helmet } from 'react-helmet-async';

import { SubscriptionsView } from 'src/sections/subscriptions/view';

// ----------------------------------------------------------------------

export default function TrainersPage() {
  return (
    <>
      <Helmet>
        <title> Subscriptions | Natural Source </title>
      </Helmet>

      <SubscriptionsView />
    </>
  );
}
