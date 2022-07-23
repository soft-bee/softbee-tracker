import { Box, Container, Typography } from '@mui/material';
import React, { createContext, FC, useState } from 'react';

import { DayTrackerTabs } from '../DayTrackerTabs';
import { ButtonDay } from '../buttons/ButtonDay';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Query } from '../../types/GraphqlTypes';
import { useCurrentWeek } from '../../hooks';
import { format, parse } from 'date-fns';
import { Maybe } from 'graphql/jsutils/Maybe';

const GET_CURRENT_WEEK_TRACKERS = gql`
  query ($weekStart: Date!, $weekEnd: Date!) {
    usersPermissionsUser(id: 1) {
      data {
        id
        attributes {
          username
          trackers(
            sort: "date"
            filters: { date: { between: [$weekStart, $weekEnd] } }
          ) {
            data {
              id
              attributes {
                date
                duration
                description
                project {
                  data {
                    attributes {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const UPDATE_TIME_DURATION = gql`
  mutation UpdateTimeDuration($id: ID!, $time: Time!) {
    updateTracker(id: $id, data: { duration: $time }) {
      data {
        attributes {
          duration
        }
      }
    }
  }
`;

type TimeContextType = {
  onUpdateTime: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    id: Maybe<string>
  ) => void;
};
export const TimeContext = createContext<TimeContextType | null>(null);

export const DayViewTracker: FC = () => {
  const { weekEnd, weekStart, days, currentDay } = useCurrentWeek();
  const { data, refetch } = useQuery<Query>(GET_CURRENT_WEEK_TRACKERS, {
    variables: { weekStart, weekEnd },
  });
  const [isDay, setIsDay] = useState(true);
  const [tabsValue, setTabsValue] = useState(+currentDay - 1);
  const [mutationTime] = useMutation(UPDATE_TIME_DURATION);

  const onUpdateTime = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    id: Maybe<string>
  ) => {
    const parseTime = format(
      parse(e.target.value, 'HH:mm', new Date()),
      'HH:mm:ss.SSS'
    );
    mutationTime({ variables: { id, time: parseTime } });
    refetch();
  };

  const currentData =
    data?.usersPermissionsUser?.data?.attributes?.trackers?.data;

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ButtonDay sx={{ mr: '10px' }}>
            <NavigateBeforeIcon />
          </ButtonDay>
          <ButtonDay>
            <NavigateNextIcon />
          </ButtonDay>
          <Typography sx={{ ml: '10px' }} variant="h5">
            Today: Monday, 11 Jul
          </Typography>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Box onClick={!isDay ? () => setIsDay(!isDay) : undefined}>
            <ButtonDay isActive={isDay} sx={{ mr: '10px' }}>
              Day
            </ButtonDay>
          </Box>
          <Box onClick={isDay ? () => setIsDay(!isDay) : undefined}>
            <ButtonDay isActive={!isDay}>Week</ButtonDay>
          </Box>
        </Box>
      </Box>
      <Box>
        <Box sx={{ mt: '10px' }}>
          <DayTrackerTabs
            dataTabs={dataTabs}
            setTabsValue={setTabsValue}
            tabsValue={tabsValue}
          />
        </Box>
      </Box>
    </Container>
  );
};
