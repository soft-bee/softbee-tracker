import React from 'react';
import { Grid } from '@mui/material';
import { Container } from '@mui/system';

type Props = {
  children: React.ReactNode;
  sidebar?: JSX.Element;
  left?: boolean;
};

export const MainWrapper: React.FC<Props> = ({ children, sidebar, left }) => {
  return (
    <Container component="main" maxWidth="lg" sx={{ paddingY: 4 }}>
      <Grid container spacing={8}>
        <Grid item order={left ? 1 : 'unset'} md={sidebar ? 8 : 12}>
          {children}
        </Grid>
        {sidebar && (
          <Grid item md={4}>
            {sidebar}
          </Grid>
        )}
      </Grid>
    </Container>
  );
};
