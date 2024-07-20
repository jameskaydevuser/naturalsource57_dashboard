import { Helmet } from 'react-helmet-async';
import { ProgramFormView } from 'src/sections/program-form/view';

// ----------------------------------------------------------------------

export default function ProgramFormPage() {
  return (
    <>
      <Helmet>
        <title> Program Form | Natural Source </title>
      </Helmet>

      <ProgramFormView />
    </>
  );
}
