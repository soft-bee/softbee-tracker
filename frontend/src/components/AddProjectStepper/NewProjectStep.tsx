import React from 'react';
import {
  Button,
  ButtonGroup,
  Typography,
  TextField,
  InputLabel,
  Stack,
  Grid,
} from '@mui/material';
import { FormikValues, useFormikContext } from 'formik';

import { CalendarPickerFormik } from 'legos';
import { FIELD_NEW_PROJECT_ENTRY } from './AddNewProject';

const paymentTypes = [
  {
    label: 'Time & Material',
    value: 'timeMaterial',
  },
  {
    label: 'Fixed Price',
    value: 'fixedPrice',
  },
  {
    label: 'Non profit',
    value: 'nonProfit',
  },
];

export const NewProjectStep = () => {
  const { values, handleChange, setFieldValue } =
    useFormikContext<FormikValues>();

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">New project</Typography>
      </Stack>

      <Stack mt={3} mb={1} gap={3}>
        <ButtonGroup size="small" fullWidth>
          {paymentTypes.map(({ label, value }) => (
            <Button
              key={value}
              size="large"
              variant={
                label === values.paymentMethod ? 'contained' : 'outlined'
              }
              onClick={() => {
                setFieldValue('paymentMethod', label);
              }}
            >
              {label}
            </Button>
          ))}
        </ButtonGroup>
        <TextField
          id={FIELD_NEW_PROJECT_ENTRY.name}
          name={FIELD_NEW_PROJECT_ENTRY.name}
          label="Name"
          multiline
          onChange={handleChange}
        />
        <TextField
          id={FIELD_NEW_PROJECT_ENTRY.client}
          name={FIELD_NEW_PROJECT_ENTRY.client}
          label="Client"
          multiline
          onChange={handleChange}
        />

        <Grid container justifyContent="space-between" columnSpacing={2}>
          <Grid item xs={6}>
            <InputLabel>
              Start Date<span style={{ color: 'red' }}>*</span>
            </InputLabel>
            <CalendarPickerFormik field={FIELD_NEW_PROJECT_ENTRY.startDate} />
          </Grid>
          <Grid item xs={6}>
            <InputLabel>
              End Date<span style={{ color: 'red' }}>*</span>
            </InputLabel>
            <CalendarPickerFormik field={FIELD_NEW_PROJECT_ENTRY.endDate} />
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
};
