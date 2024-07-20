import { Helmet } from 'react-helmet-async';

import { TrainersView } from 'src/sections/trainers/view';

// ----------------------------------------------------------------------

export default function TrainersPage() {
  return (
    <>
      <Helmet>
        <title> Traienrs | Natural Source </title>
      </Helmet>

      <TrainersView />
    </>
  );
}
