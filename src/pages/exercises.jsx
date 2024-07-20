import { Helmet } from 'react-helmet-async';
import { ExercisesView } from 'src/sections/exercises/view';

// ----------------------------------------------------------------------

export default function ExercisesPage() {
  return (
    <>
      <Helmet>
        <title> Exercises | Natural Source </title>
      </Helmet>

      <ExercisesView />
    </>
  );
}
