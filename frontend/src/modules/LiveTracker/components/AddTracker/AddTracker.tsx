import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import { GraphQLError } from 'graphql';
import { Paper } from '@mui/material';

import {
  TimeEntryValues,
  TrackerEntryModalForm,
} from 'components/TrackerEntryModalForm';

import { useCreateTracker, usePauseTracker } from '../../hooks';
import { IconButtonTracker } from '../../helpers';
import { useQuery } from '@apollo/client';
import { TRACKERS_QUERY } from 'api';
import {
  TrackerEntityResponseCollection,
  TrackerFiltersInput,
  Enum_Tracker_Live_Status,
} from 'types/GraphqlTypes';

type AddTrackerProps = {
  userId: string;
};

export const AddTracker = ({ userId }: AddTrackerProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { createTracker } = useCreateTracker();
  const { pauseTracker } = usePauseTracker();

  const [isOpenModal, setIsOpenModal] = useState(false);

  const { data } = useQuery<
    {
      trackers: TrackerEntityResponseCollection;
    },
    {
      filters: TrackerFiltersInput;
    }
  >(TRACKERS_QUERY, {
    variables: {
      filters: {
        user: { id: { eq: userId } },
        live: { eq: true },
        live_status: { eq: Enum_Tracker_Live_Status.Start },
      },
    },
    skip: !userId,
  });
  const liveTracker = data?.trackers.data;
  const toggleOpenModal = () => {
    setIsOpenModal(!isOpenModal);
  };
  const handelSubmit = (values: TimeEntryValues) => {
    if (liveTracker?.length) {
      pauseTracker(liveTracker[0])
        .then(() => {
          enqueueSnackbar(`Tracker paused`, { variant: 'success' });
        })
        .catch((error: GraphQLError) => {
          enqueueSnackbar(error.message, { variant: 'error' });
        });
    }
    createTracker(userId, values)
      .then(() => {
        enqueueSnackbar(`the countdown has started`, { variant: 'success' });
        toggleOpenModal();
      })
      .catch((error: GraphQLError) => {
        enqueueSnackbar(error.message, { variant: 'error' });
      });
  };
  return (
    <>
      <TrackerEntryModalForm
        isLive
        open={isOpenModal}
        onClose={toggleOpenModal}
        onSubmit={(values) => handelSubmit(values)}
        titleForm="New live time entry"
        userId={userId}
        buttonSubmitTitle="Start"
      />
      <Paper
        sx={{
          boxShadow: '0px 0px 23px 1px rgba(120,120,120,0.75)',
        }}
      >
        <IconButtonTracker onClick={toggleOpenModal}>
          <AddIcon color="primary" />
        </IconButtonTracker>
      </Paper>
    </>
  );
};
