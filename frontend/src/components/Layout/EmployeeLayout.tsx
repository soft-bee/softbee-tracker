import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
import { Header } from '../Header';
import { employeePages } from '../../constants';

export const EmployeeLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={'/login'} replace />;
  }

  return (
    <>
      <Header pages={employeePages} />
      <Outlet />
    </>
  );
};
