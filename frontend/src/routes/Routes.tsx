import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuthUser } from 'hooks';
import { Loader, Layout } from 'components';
import { NotFoundPage } from 'pages';
import { pages } from 'constant';
import { LiveTracker } from 'modules';

export const AppRouter = () => {
  const { jwt, user, isAuth } = useAuthUser();

  if (jwt !== null && !isAuth) return <Loader />;

  const currentPages = pages.filter(({ role }) =>
    role.includes(user.role.type)
  );

  return (
    <Routes>
      <Route element={<Layout pages={currentPages} />}>
        <Route
          path="*"
          element={isAuth ? <NotFoundPage /> : <Navigate to="/login" replace />}
        />
        {isAuth && (
          <>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
          </>
        )}
        {currentPages.map(({ index, name, href, Component }) => (
          <Route
            index={index}
            key={name}
            path={href}
            element={
              <Suspense fallback={<div />}>
                <Component title={name} />
                {isAuth && <LiveTracker />}
              </Suspense>
            }
          />
        ))}
      </Route>
    </Routes>
  );
};
