import React, { useState } from 'react';

import { useProject } from 'hooks';
import { Enum_Project_Type, Scalars } from 'types/GraphqlTypes';
import { Stack, Typography } from '@mui/material';
import { Avatar, Button, Icon, NavLink } from 'legos';
import { toHoursAndMinutes } from 'components/TimePicker/utils';
import { AddNewProject } from 'components/AddProjectStepper';

type Props = {
  id: Scalars['ID'];
};
export const ProjectInfoTab = ({ id }: Props) => {
  const { projectData, manager, refetch } = useProject(id);
  const [isEditProject, setIsEditProject] = useState(false);

  let trakedTime = '';
  const getProjectType: (type?: string) => JSX.Element | null = (type) => {
    switch (type) {
      case Enum_Project_Type.TimeMaterial:
        return (
          <>
            <Icon icon="paidOutlined" color="warning" />
            <Stack flexGrow="1">
              <Typography fontSize="15px" color="GrayText">
                Project type
              </Typography>
              <Typography>Time&Material</Typography>
            </Stack>
          </>
        );
      case Enum_Project_Type.FixedPrice:
        return (
          <>
            <Icon icon="paidOutlined" color="success" />
            <Stack flexGrow="1">
              <Typography fontSize="15px" color="GrayText">
                Project type
              </Typography>
              <Typography>Fixed Price</Typography>
            </Stack>
          </>
        );
      case Enum_Project_Type.NonProfit:
        return (
          <>
            <Icon icon="paidOutlined" color="error" />
            <Stack flexGrow="1">
              <Typography fontSize="15px" color="GrayText">
                Project type
              </Typography>
              <Typography>Non Profit</Typography>
            </Stack>
          </>
        );
      default:
        return null;
    }
  };

  if (projectData?.trackers?.data[0]?.attributes?.durationMinutes) {
    trakedTime = toHoursAndMinutes(
      projectData.trackers.data[0].attributes.durationMinutes ?? 0
    );
  }

  const handleSetEditProject = (value: boolean) => {
    if (!value) {
      refetch();
    }
    setIsEditProject(value);
  };

  return projectData ? (
    <>
      {isEditProject ? (
        <AddNewProject
          handleSetCreateProject={handleSetEditProject}
          projectId={id}
        />
      ) : (
        <Stack width="100%" flexDirection="row" gap={8}>
          <Stack width="100%" gap={4}>
            <Stack flexDirection="row" justifyContent="space-between">
              <Stack>
                <Typography variant="h1">{projectData.name}</Typography>
                <Typography fontSize="15px" color="GrayText">
                  Project details
                </Typography>
              </Stack>
              <Button
                title="Edit"
                variant="outlined"
                type="button"
                icon="edit"
                sx={{ height: 36 }}
                onClick={() => handleSetEditProject(!isEditProject)}
              />
            </Stack>
            {projectData.manager?.data?.id && (
              <Stack flexDirection="row" alignItems="center" gap={1}>
                <Avatar
                  avatar={
                    manager?.avatar?.data?.attributes?.url
                      ? `${process.env.REACT_APP_URI}${manager?.avatar.data?.attributes?.url}`
                      : undefined
                  }
                  firstName={manager?.firstName}
                  lastName={manager?.lastName}
                />
                <Stack flexGrow="1">
                  <Typography fontSize="15px" color="GrayText">
                    Project manager
                  </Typography>
                  <NavLink
                    to={`/profile/${projectData.manager?.data?.id}`}
                    state={{ edit: false }}
                  >
                    {`${manager?.firstName} ${manager?.lastName}`}
                  </NavLink>
                </Stack>
              </Stack>
            )}
            <Stack flexDirection="row" alignItems="center" gap={3}>
              {getProjectType(projectData.type)}
            </Stack>
            <Stack flexDirection="row" alignItems="center" gap={3}>
              <Icon icon="calendarMonth" />
              <Stack flexGrow="1">
                <Typography fontSize="15px" color="GrayText">
                  Project start
                </Typography>
                <Typography>{projectData.start}</Typography>
              </Stack>
            </Stack>
            {projectData.end && (
              <Stack flexDirection="row" alignItems="center" gap={3}>
                <Icon icon="calendarMonth" />
                <Stack flexGrow="1">
                  <Typography fontSize="15px" color="GrayText">
                    Project end
                  </Typography>
                  <Typography>{projectData.end}</Typography>
                </Stack>
              </Stack>
            )}
            <Stack flexDirection="row" alignItems="center" gap={3}>
              <Icon icon="person" />
              <Stack flexGrow="1">
                <Typography fontSize="15px" color="GrayText">
                  Client
                </Typography>
                <Typography>{projectData.client}</Typography>
              </Stack>
            </Stack>
            {!!trakedTime && (
              <Stack flexDirection="row" alignItems="center" gap={3}>
                <Icon icon="calendarMonth" />

                <Stack flexGrow="1">
                  <Typography fontSize="15px" color="GrayText">
                    Tracked time
                  </Typography>
                  <Typography>{trakedTime}</Typography>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Stack>
      )}
    </>
  ) : null;
};
