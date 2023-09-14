import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  eachDayOfInterval,
  endOfYear,
  format,
  isSameDay,
  isWeekend,
  startOfYear,
} from 'date-fns';
import * as yup from 'yup';

import { useAuthUser, useBreaks, useNormalizedTrackers } from 'hooks';
import { Icon, RangeCalendar } from 'legos';
import { getFormattedDate, toUpperCaseFirst, formikPropsErrors } from 'helpers';
import { Breaks } from 'constant';
import { useFormik } from 'formik';
import { BreaksRequestFields, BreaksRequestFormProps } from './types';
import { useSnackbar } from 'notistack';
import { TimeEntryValues } from 'components/TrackerEntryModalForm';
import { useCreateTracker } from 'hooks/useCreateTracker';
import { getBreakIcon } from 'components/BreaksDay/getBreakIcon';
import { Enum_Tracker_Status } from 'types/GraphqlTypes';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
};

const VACATION_DAYS = 30;
const SICKNESS_DAYS = 5;

const CountDay = ({ count }: { count: number }) => (
  <Typography component={'span'} fontWeight="600">
    {`${count} ${count === 1 ? 'day' : 'days'}`}
  </Typography>
);

export const BreaksRequestForm: React.FC<BreaksRequestFormProps> = ({
  onClose,
}) => {
  const { user } = useAuthUser();
  const { enqueueSnackbar } = useSnackbar();
  const { createTracker } = useCreateTracker();
  const { breaks, breaksChoices, loading } = useBreaks(
    { users: { id: { eq: user.id } } },
    {
      user: {
        id: {
          eq: user.id,
        },
      },
      date: {
        between: [
          getFormattedDate(startOfYear(new Date())),
          getFormattedDate(endOfYear(new Date())),
        ],
      },
    }
  );
  const filters = {
    user: { id: { in: [user.id] } },
    status: { eq: Enum_Tracker_Status.Approved },
  };

  const { fetchTrackers, trackers } = useNormalizedTrackers(filters, false);
  const approvedDates = trackers?.map(
    (tracker) => new Date(tracker.attributes?.date)
  );
  const disabledDates = (date: Date) =>
    eachDayOfInterval({
      start: date,
      end: date,
    }).some((day) =>
      approvedDates?.some((approvedDate) => isSameDay(approvedDate, day))
    );
  useEffect(() => {
    fetchTrackers({
      variables: { filters },
    });
  }, [user.id]);

  const [selectedDates, setSelectedDates] = useState([new Date()]);
  const [breakId, setBreakId] = useState('');

  const breaksDateArray = eachDayOfInterval({
    start: selectedDates[0],
    end: selectedDates.length > 1 ? selectedDates[1] : selectedDates[0],
  }).filter((date) => !isWeekend(date));

  const selectedBreak = breaks?.find(({ id }) => id === breakId);
  const selectedBreakType = selectedBreak?.attributes?.name.toLowerCase();
  const selectedUsedBreakDays = selectedBreak?.attributes?.trackers?.data
    .length as number;

  const breaksDaysUserHave =
    selectedBreakType === Breaks.Vacation
      ? VACATION_DAYS - selectedUsedBreakDays
      : selectedBreakType === Breaks.Sickness
      ? SICKNESS_DAYS - selectedUsedBreakDays
      : 0;

  const initialValues = {
    [BreaksRequestFields.USER]: user.id,
    [BreaksRequestFields.PROJECT]: '',
    [BreaksRequestFields.DATE]: new Date(),
    [BreaksRequestFields.DURATION]: 300,
    [BreaksRequestFields.DESCRIPTION]: '',
    [BreaksRequestFields.STATUS]: Enum_Tracker_Status.New,
  };
  const validationSchema = yup.object({
    [BreaksRequestFields.DESCRIPTION]: yup
      .string()
      .min(5, 'Description must be at least 5 characters')
      .required('Should not be empty'),
  });

  const formik = useFormik<TimeEntryValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const approvedDates = trackers?.map(
        (tracker) => new Date(tracker.attributes?.date)
      );

      const formattedBreakDates = breaksDateArray.map((date) =>
        format(date, 'yyyy-MM-dd')
      );
      const formattedDates = approvedDates?.map((date) =>
        format(date, 'yyyy-MM-dd')
      );
      const filteredDates = formattedBreakDates.filter(
        (item) => !formattedDates?.includes(item)
      );

      for (const date of filteredDates) {
        const data = {
          ...values,
          date: date,
        };
        await createTracker(data)
          .then(() => {
            enqueueSnackbar(`Request sent for ${date}`, { variant: 'success' });
          })
          .catch((error) => {
            enqueueSnackbar(error.message, { variant: 'error' });
          });
      }
      onClose();
    },
  });

  const { values, handleChange, handleSubmit, setFieldValue } = formik;

  useEffect(() => {
    const breaksChoiceId = breaksChoices?.find(
      ({ label }) => label === toUpperCaseFirst(Breaks.Vacation)
    )?.value as string;

    setFieldValue(BreaksRequestFields.PROJECT, breaksChoiceId);
    setFieldValue(BreaksRequestFields.USER, user.id);
    setBreakId(breaksChoiceId);
  }, [loading]);

  return (
    <Stack component="form" gap={4} sx={modalStyle} onSubmit={handleSubmit}>
      <Typography variant="h6">Request leave</Typography>
      <Box>
        <Stack
          direction="row"
          alignItems="center"
          border={(t) => `1px solid ${t.palette.primary.main}`}
          borderRadius={1}
          gap={2}
          p={2}
        >
          <Icon icon="info" color="primary" />
          {selectedBreakType !== Breaks.Unpaid ? (
            <Typography>
              You request for <CountDay count={breaksDateArray.length} /> of
              paid time off, from <CountDay count={breaksDaysUserHave} /> you
              have.
            </Typography>
          ) : (
            <Typography>
              You request for <CountDay count={breaksDateArray.length} /> of
              unpaid time off.
            </Typography>
          )}
        </Stack>
        <Box height={24}>
          {!(breaksDaysUserHave >= breaksDateArray.length) &&
          formik.values.project !== '16' ? (
            <Typography color="red" mt={0.5}>
              Please add the available number of days
            </Typography>
          ) : null}
        </Box>
      </Box>
      <ButtonGroup fullWidth>
        {breaksChoices?.map(({ label, value }) => (
          <Button
            key={value}
            variant={
              value === values[BreaksRequestFields.PROJECT]
                ? 'contained'
                : 'outlined'
            }
            startIcon={getBreakIcon(label)}
            onClick={() => {
              setFieldValue(BreaksRequestFields.PROJECT, value);
              setBreakId(value as string);
            }}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
      <RangeCalendar
        disablePast
        isRequestLeave
        maxDate={endOfYear(new Date())}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
        shouldDisableDate={disabledDates}
      />
      <TextField
        label="Comment"
        fullWidth
        multiline
        rows={4}
        value={values[BreaksRequestFields.DESCRIPTION]}
        name={BreaksRequestFields.DESCRIPTION}
        {...formikPropsErrors(BreaksRequestFields.DESCRIPTION, formik)}
        onChange={handleChange}
      />
      <Stack direction="row" gap={2} justifyContent="flex-end">
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={
            !(breaksDaysUserHave >= breaksDateArray.length) &&
            formik.values.project !== '16'
          }
          variant="contained"
          type="submit"
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
};
