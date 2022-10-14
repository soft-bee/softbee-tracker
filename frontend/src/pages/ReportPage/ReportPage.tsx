import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Stack, Typography } from '@mui/material';

import { MainWrapper, ReportTable } from '../../components';
import { PageProps } from '../types';
import { useNormalizedTrackers, usePageTitle } from 'hooks';
import { getFormattedDate, getHours } from 'helpers';
import { ReportPageSidebar } from './ReportPageSidebar';

const ReportPage: React.FC<PageProps> = ({ title }) => {
  const { setTitle } = usePageTitle(title as string);

  const [selectedDates, setSelectedDates] = useState([
    getFormattedDate(new Date()),
  ]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [checked, setChecked] = useState(true);
  useEffect(() => {
    setTitle();
  }, []);
  const reportFilter = {
    user: {
      id: selectedEmployees.length !== 0 ? { in: selectedEmployees } : {},
    },
    project: {
      id: selectedProjects.length !== 0 ? { in: selectedProjects } : {},
    },
    date:
      selectedDates.length > 1
        ? { between: selectedDates }
        : { eq: selectedDates[0] },
  };

  const { normalizedTrackers } = useNormalizedTrackers(reportFilter);

  const reportTotalTime = useMemo(() => {
    let totalTime = 0;
    normalizedTrackers.forEach(({ total }) => (totalTime += total));

    return getHours(totalTime);
  }, [normalizedTrackers]);

  const reportSidebarProps = {
    checked,
    setChecked,
    selectedDates,
    selectedEmployees,
    selectedProjects,
    setSelectedDates,
    setSelectedEmployees,
    setSelectedProjects,
  };

  return (
    <MainWrapper sidebar={<ReportPageSidebar {...reportSidebarProps} />}>
      <Typography variant="h1">{title}</Typography>
      <Stack mt={6} flexDirection="row" justifyContent="space-between">
        <Stack flexDirection="row" gap={2}>
          <Typography fontWeight="600">Period:</Typography>
          <Typography>
            {`${format(new Date(selectedDates[0]), 'd MMM yyyy')}${
              selectedDates[1]
                ? ` - ${format(new Date(selectedDates[1]), 'd MMM yyyy')}`
                : ''
            }`}
          </Typography>
        </Stack>
        <Stack flexDirection="row" gap={2}>
          <Typography fontWeight="600">Total:</Typography>
          <Typography>{reportTotalTime}</Typography>
        </Stack>
      </Stack>
      <Stack mt={6}>
        <ReportTable trackers={normalizedTrackers} isShowVacation={checked} />
      </Stack>
    </MainWrapper>
  );
};

export default ReportPage;
