import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/user/view';
import { OrderView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function OrdersPage() {
  return (
    <>
      <Helmet>
        <title> Orders | Natural Source </title>
      </Helmet>

      <OrderView />
    </>
  );
}
