import React, { Fragment } from 'react';
import { Avatar, Grid, IconButton, Link } from '@mui/material';

import { UniversalAvatar, Icon } from 'legos';

//TODO add projects info and info about PR
const projects = [
  {
    id: 1,
    projectName: 'UpWork',
    timeLine: '20.11.21-12.12.23',
    projectManager: 'Oleksandr Zastavnyi',
    type: 'paid',
  },
  {
    id: 3,
    projectName: 'Plumbid',
    timeLine: '20.11.21-12.12.23',
    projectManager: 'Yura Moldavchuk',
    type: 'paid',
  },
  {
    id: 4,
    projectName: 'PalPal',
    timeLine: '20.11.21-12.12.23',
    projectManager: 'Andrev Antonuch',
    type: 'unpaid',
    projectManagerAvatar: 'https://i.pravatar.cc/300',
  },
];

export const ProjectList = () => (
  <Grid
    container
    spacing={2}
    marginTop={2}
    justifyContent="space-between"
    alignItems="flex-start"
  >
    {projects.map((project) => (
      <Fragment key={project.id}>
        <Grid item xs={4} container alignItems="center">
          <Avatar>
            {project.type == 'paid' ? (
              <Icon icon="paidOutlined" color="blue" />
            ) : (
              <Icon icon="moneyOff" color="red" />
            )}
          </Avatar>
          <Link href="*" sx={{ ml: 3 }}>
            {project.projectName}
          </Link>
        </Grid>
        <Grid container gap={2} item xs={4} alignItems="center">
          <UniversalAvatar
            avatar={project.projectManagerAvatar}
            name={project.projectManager}
          />
          <Link href="*" underline="none">
            {project.projectManager}
          </Link>
        </Grid>
        <Grid item container xs={2}>
          <IconButton aria-label="edit">
            <Icon icon="editOutlined" />
          </IconButton>
          <IconButton aria-label="archive">
            <Icon icon="archiveOutlined" />
          </IconButton>
        </Grid>
      </Fragment>
    ))}
  </Grid>
);
