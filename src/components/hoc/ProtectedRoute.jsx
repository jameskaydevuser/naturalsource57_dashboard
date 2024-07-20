import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'src/routes/hooks';
import { AuthContext } from 'src/contexts/Auth';

export default function ProtectedRoute({ children }) {
  const user = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    } else {
      router.replace('/users')
    }
  }, []);

  return <>{user && children}</>;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
