import React, { useState } from 'react';
import {
  Button,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { FormikContext, useFormik } from 'formik';
import { addYears } from 'date-fns';
import * as yup from 'yup';

import {
  useCreateProject,
  useNormalizedUsers,
  useUpdateProject,
  useProject,
} from 'hooks';
import { Loader, NewProjectStep, SummaryStep, TeamStep } from 'components';
import { CreateProjectFields, CreateProjectStep, ProjectProps } from './types';
import { Enum_Project_Type } from 'types/GraphqlTypes';
import { getFormattedDate } from 'helpers';

const steps: CreateProjectStep[] = [
  {
    name: 'Info',
    fields: [CreateProjectFields.Name, CreateProjectFields.Client],
  },
  {
    name: 'Team',
    fields: [CreateProjectFields.Manager, CreateProjectFields.Users],
  },
  {
    name: 'Summary',
    fields: [],
  },
];

export const AddNewProject = ({
  handleSetCreateProject,
  projectId,
}: ProjectProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const { createProject } = useCreateProject();
  const { updateProject } = useUpdateProject();

  const { projectData } = useProject(projectId);
  const { users } = useNormalizedUsers();

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <NewProjectStep />;
      case 1:
        return <TeamStep />;
      case 2:
        return <SummaryStep />;
      default:
        return <Loader />;
    }
  };

  const initialValues =
    projectId && projectData
      ? {
          [CreateProjectFields.Type]: projectData?.type,
          [CreateProjectFields.Name]: projectData?.name,
          [CreateProjectFields.Client]: projectData?.client,
          [CreateProjectFields.Start]: new Date(projectData?.start),
          [CreateProjectFields.End]: new Date(projectData?.end),
          [CreateProjectFields.Manager]: projectData?.manager?.data?.id,
          [CreateProjectFields.Salary]: projectData?.salary?.map((el) => {
            const user = users?.find(
              (user) =>
                user.attributes?.lastName ===
                el?.users?.data?.attributes?.lastName
            );

            return { id: el?.id ?? undefined, users: user?.id, rate: el?.rate };
          }),
          [CreateProjectFields.Users]: projectData?.salary?.map(
            (el) => el?.users?.data?.id ?? null
          ),
        }
      : {
          [CreateProjectFields.Type]: Enum_Project_Type.TimeMaterial,
          [CreateProjectFields.Name]: '',
          [CreateProjectFields.Client]: '',
          [CreateProjectFields.Start]: new Date(),
          [CreateProjectFields.End]: addYears(new Date(), 1),
          [CreateProjectFields.Manager]: '',
          [CreateProjectFields.Salary]: [],
          [CreateProjectFields.Users]: [],
        };

  const validationSchema = yup.object({
    [CreateProjectFields.Name]: yup
      .string()
      .min(5, 'Project title must be at least 5 characters')
      .required('Should not be empty'),
    [CreateProjectFields.Client]: yup
      .string()
      .min(5, 'Client name must be at least 5 characters')
      .required('Should not be empty'),
    [CreateProjectFields.Manager]: yup.string().required('Should not be empty'),
    [CreateProjectFields.Users]: yup.array().min(1, 'Minimum one employee'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: !!projectId,
    onSubmit: (values) => {
      const data = {
        ...values,
        [CreateProjectFields.Start]: getFormattedDate(
          values[CreateProjectFields.Start]
        ),
        [CreateProjectFields.End]: getFormattedDate(
          values[CreateProjectFields.End]
        ),
      };
      projectId
        ? updateProject(projectId, data).then(() => {
            handleSetCreateProject(false);
          })
        : createProject(data).then(() => {
            handleSetCreateProject(false);
          });
    },
  });

  const handleNext = () => {
    setActiveStep(activeStep + 1);

    if (activeStep === steps.length - 2) {
      formik.validateForm().then((errors) => {
        const errorsKeys = Object.keys(errors);

        if (errorsKeys.length === 0) return;

        const touched: { [key: string]: boolean } = {};
        const errorOnStep = steps.indexOf(
          steps.find(({ fields }) =>
            fields.find((i) => errorsKeys.includes(i))
          ) ?? ({} as CreateProjectStep)
        );

        errorsKeys.forEach((e) => {
          touched[e] = true;
        });

        formik.setTouched(touched);
        setActiveStep(errorOnStep);
      });
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <FormikContext.Provider value={formik}>
      <Stack height="100%">
        <Typography variant="h1">
          {projectId ? 'Edit project' : 'Add new project'}
        </Typography>
        <Stack
          component="form"
          onSubmit={formik.handleSubmit}
          justifyContent="space-between"
          flexGrow="1"
          gap={4}
          mt={6}
        >
          <Stack gap={8}>
            <Stepper activeStep={activeStep}>
              {steps.map(({ name }) => (
                <Step key={name}>
                  <StepLabel>{name}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {getStepContent(activeStep)}
          </Stack>
          <Stack direction="row" justifyContent="flex-end" gap={2}>
            {activeStep !== steps.length &&
              (activeStep !== 0 ? (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{ width: 150 }}
                >
                  Back
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => handleSetCreateProject(false)}
                  sx={{ width: 150 }}
                >
                  Cancel
                </Button>
              ))}

            <Button
              variant="contained"
              disabled={formik.isSubmitting}
              type={activeStep >= steps.length ? 'submit' : 'button'}
              onClick={handleNext}
              sx={{ width: 150 }}
            >
              {activeStep >= steps.length - 1
                ? projectId
                  ? 'Update'
                  : 'Create'
                : 'Next'}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </FormikContext.Provider>
  );
};
