import React from 'react';
import { IconButton, Link, Stack, Typography } from '@mui/material';

import { Avatar, Icon, NavLink } from 'legos';
import { ProjectEntity, Enum_Project_Type } from 'types/GraphqlTypes';

type ProjectsListProps = {
  projectsList?: ProjectEntity[];
  setIsCreateProject: React.Dispatch<React.SetStateAction<boolean>>;
  setProjectId: React.Dispatch<React.SetStateAction<string>>;
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

export const ProjectsList = ({
  projectsList,
  setIsCreateProject,
  setProjectId,
}: ProjectsListProps) => {
  const handlerEditProject = (id: string) => {
    setIsCreateProject(true);
    setProjectId(id);
  };

  return (
    <>
      {projectsList?.map((project) => {
        return (
          <Stack
            key={project.id}
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Stack>{getProjectIcon(project.attributes?.type)}</Stack>

              <Stack>
                <Link to={`/project/${project.id}`} component={NavLink}>
                  {project.attributes?.name}
                </Link>
                <Typography fontSize="10px">{`${project.attributes?.start} - ${project.attributes?.start}`}</Typography>
              </Stack>
            </Stack>

            <Stack gap={2}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                width="300px"
              >
                <Avatar
                  avatar={
                    project.attributes?.manager?.data?.attributes?.avatar?.data
                      ?.attributes?.url
                      ? `${process.env.REACT_APP_URI}${project.attributes?.manager?.data?.attributes?.avatar.data?.attributes?.url}`
                      : undefined
                  }
                  firstName={
                    project.attributes?.manager?.data?.attributes?.firstName
                  }
                  lastName={
                    project.attributes?.manager?.data?.attributes?.lastName
                  }
                />
                <NavLink
                  to={`/profile/${project.attributes?.manager?.data?.id}`}
                  state={{ edit: false }}
                >
                  {`${project.attributes?.manager?.data?.attributes?.firstName} ${project.attributes?.manager?.data?.attributes?.lastName}`}
                </NavLink>
              </Stack>
            </Stack>

            <Stack direction="row">
              <IconButton
                onClick={() => handlerEditProject(project.id as string)}
                aria-label="edit"
              >
                <Icon icon="editOutlined" />
              </IconButton>
              <IconButton aria-label="archive">
                <Icon icon="archiveOutlined" />
              </IconButton>
            </Stack>
          </Stack>
        );
      })}
    </>
  );
};
