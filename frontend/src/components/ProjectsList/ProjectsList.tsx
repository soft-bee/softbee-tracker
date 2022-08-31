import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { IconButton, Link, Stack, Typography } from '@mui/material';

import { Avatar, Icon, NavLink } from 'legos';
import { ProjectEntity, Enum_Project_Type } from 'types/GraphqlTypes';

type ProjectsListProps = {
  projectsList?: ProjectEntity[];
};

const getProjectIcon: (type?: string) => JSX.Element | null = (type) => {
  switch (type) {
    case Enum_Project_Type.TimeMaterial:
      return <Icon icon="paidOutlined" color="warning" />;
    case Enum_Project_Type.FixedPrice:
      return <Icon icon="paidOutlined" color="success" />;
    case Enum_Project_Type.NonProfit:
      return <Icon icon="paidOutlined" color="error" />;
    default:
      return null;
  }
};

export const ProjectsList = ({ projectsList }: ProjectsListProps) => {
  return (
    <>
      {projectsList?.map((project) => (
        <Stack
          key={project.id}
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Stack>{getProjectIcon(project.attributes?.type)}</Stack>

            <Stack>
              <Link component={NavLink} to="*">
                {project.attributes?.name}
              </Link>
              <Typography fontSize="10px">{`${project.attributes?.start} - ${project.attributes?.start}`}</Typography>
            </Stack>
          </Stack>

          <Stack gap={2}>
            {project.attributes?.managers?.data.map(({ id, attributes }) => (
              <Stack
                key={id}
                direction="row"
                alignItems="center"
                spacing={1}
                width="300px"
              >
                <Avatar
                  avatar={
                    attributes?.avatar.data?.attributes?.url
                      ? `${process.env.REACT_APP_URI}${attributes?.avatar.data?.attributes?.url}`
                      : undefined
                  }
                  firstName={attributes?.firstName}
                  lastName={attributes?.lastName}
                />
                <Link to={`/profile/view/${id}`} component={NavLink}>
                  {`${attributes?.firstName} ${attributes?.lastName}`}
                </Link>
              </Stack>
            ))}
          </Stack>

          <Stack direction="row">
            <IconButton aria-label="edit">
              <Icon icon="editOutlined" />
            </IconButton>
            <IconButton aria-label="archive">
              <Icon icon="archiveOutlined" />
            </IconButton>
          </Stack>
        </Stack>
      ))}
    </>
  );
};
