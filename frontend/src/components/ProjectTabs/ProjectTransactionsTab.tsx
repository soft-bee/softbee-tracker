import React, { useState } from 'react';

import { Grid } from '@mui/material';
import { ReportTable } from '..';
import { getFormattedDate } from 'helpers';
import { useNormalizedTrackers } from 'hooks';
import { RangeCalendar } from 'legos';
import { AddNewTransaction } from 'components/AddNewTransaction';

type Props = {
  projectId: string;
};

export const ProjectTransactionsTab = ({ projectId }: Props) => {
  const [selectedDates, setSelectedDates] = useState([new Date()]);

  const reportFilter = {
    user: {
      id: { in: selectedEmployees },
    },
    project: {
      id: { in: [projectId] },
    },
    date:
      selectedDates.length > 1
        ? {
            between: [
              getFormattedDate(selectedDates[0]),
              getFormattedDate(selectedDates[1]),
            ],
          }
        : { eq: getFormattedDate(selectedDates[0]) },
  };

  const { normalizedTrackers } = useNormalizedTrackers(reportFilter, true);

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={4}
    >
      <Grid xs={5} item>
        <RangeCalendar
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
        />
      </Grid>
      <Grid item xs={2}>
        <AddNewTransaction />
      </Grid>
      <Grid item xs={12}>
        <ReportTable trackers={normalizedTrackers} />
      </Grid>
    </Grid>
  );
};
