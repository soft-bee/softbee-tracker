import { useMutation, useQuery } from '@apollo/client';
import { subMinutes } from 'date-fns';

import { TRACKERS_QUERY, UPDATE_TRACKER_BY_ID_MUTATION } from 'api';
import {
  Enum_Tracker_Live_Status,
  MutationUpdateTrackerArgs,
  TrackerEntity,
  TrackerEntityResponse,
  TrackerEntityResponseCollection,
  TrackerFiltersInput,
} from 'types/GraphqlTypes';
import { usePauseTracker } from './usePauseTracker';
import { GraphQLError } from 'graphql';
import { useSnackbar } from 'notistack';
import { useAuthUser } from 'hooks';

const useStartTracker = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { pauseTracker } = usePauseTracker();
  const [start] = useMutation<TrackerEntityResponse, MutationUpdateTrackerArgs>(
    UPDATE_TRACKER_BY_ID_MUTATION
  );
  const { user } = useAuthUser();

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
        user: { id: { eq: user.id } },
        live: { eq: true },
        live_status: { eq: Enum_Tracker_Live_Status.Start },
      },
    },
    skip: !user.id,
  });
  const liveTracker = data?.trackers.data;

  const startTracker = (tracker: TrackerEntity) => {
    if (liveTracker?.length) {
      pauseTracker(liveTracker[0])
        .then(() => {
          enqueueSnackbar(`Tracker paused`, { variant: 'success' });
        })
        .catch((error: GraphQLError) => {
          enqueueSnackbar(error.message, { variant: 'error' });
        });
    }

    const minutes = tracker.attributes?.durationMinutes ?? 0;
    return start({
      variables: {
        id: tracker.id as string,
        data: {
          live: true,
          live_status: Enum_Tracker_Live_Status.Start,
          startLiveDate: subMinutes(
            new Date(),
            tracker.attributes?.live
              ? tracker.attributes?.liveDurationMinutes
              : tracker.attributes?.liveDurationMinutes + minutes
          ),
          liveDurationMinutes: null,
        },
      },
      refetchQueries: [TRACKERS_QUERY],
    });
  };
  return { startTracker };
};

export { useStartTracker };
