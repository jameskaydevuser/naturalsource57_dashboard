/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';
import { useEffect } from 'react';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './hooks/auth';
import { AuthContext } from './contexts/Auth';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
  const { unsubscriberAuth, user } = useAuth();

  useEffect(() => {
    const unsubscriber = unsubscriberAuth();

    return () => unsubscriber();
  }, []);

  return (
    <AuthContext.Provider value={user}>
      <ThemeProvider>
        <Router />
        <ToastContainer />
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
