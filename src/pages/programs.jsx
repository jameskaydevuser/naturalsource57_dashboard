import { Helmet } from 'react-helmet-async';
import { ProgramsView } from 'src/sections/programs/view';

// ----------------------------------------------------------------------

export default function ProgramsPage() {
  return (
    <>
      <Helmet>
        <title> Programs | Natural Source </title>
      </Helmet>

      <ProgramsView />
    </>
  );
}
