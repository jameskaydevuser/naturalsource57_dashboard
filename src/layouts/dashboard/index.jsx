import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import Nav from './nav';
import Main from './main';
import Header from './header';
import { useUsers } from 'src/hooks/users';
import { UsersContext } from 'src/contexts/Users';
import { useTrainers } from 'src/hooks/trainers';
import { TrainersContext } from 'src/contexts/Trainers';
import { SubscriptionsContext } from 'src/contexts/Subscriptions';
import { useSubscriptions } from 'src/hooks/subscriptions';
import { useExercises } from 'src/hooks/exercises';
import { ExercisesContext } from 'src/contexts/Exercises';
import { usePrograms } from 'src/hooks/programs';
import { ProgramsContext } from 'src/contexts/Programs';
import { NewsContext } from 'src/contexts/News'
import { useNews } from 'src/hooks/news';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);

  const { loading: userLoading, users } = useUsers();
  const { trainers, loading: trainersLoading } = useTrainers();
  const { subscriptions, loading: subscriptionsLoading } = useSubscriptions();
  const { exercises, loading: exercisesLoading } = useExercises();
  const { programs, loading: programsLoading } = usePrograms();
  const { news, loading: newsLoading } = useNews();

  return (
    <ProgramsContext.Provider value={{ programs, loading: programsLoading }}>
      <NewsContext.Provider value={{ news, loading: newsLoading }}>
        <UsersContext.Provider value={{ users, loading: userLoading }}>
          <TrainersContext.Provider value={{ trainers, loading: trainersLoading }}>
            <SubscriptionsContext.Provider value={{ subscriptions, loading: subscriptionsLoading }}>
              <ExercisesContext.Provider value={{ exercises, loading: exercisesLoading }}>
                {/* <Header onOpenNav={() => setOpenNav(true)} /> */}

                <Box
                  sx={{
                    minHeight: 1,
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                  }}
                >
                  <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

                  <Main>{children}</Main>
                </Box>
              </ExercisesContext.Provider>
            </SubscriptionsContext.Provider>
          </TrainersContext.Provider>
        </UsersContext.Provider>
      </NewsContext.Provider>
    </ProgramsContext.Provider>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
