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
    name: 'New project',
    fields: [CreateProjectFields.Name, CreateProjectFields.Client],
  },
  {
    name: 'Team',
    fields: [CreateProjectFields.Managers, CreateProjectFields.Users],
  },
  {
    name: 'Summary',
    fields: [],
  },
];

export const AddNewProject: React.FC<ProjectProps> = ({
  setIsCreateProject,
  projectStatus = 'Add New Project',
  projectId,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const { createProject } = useCreateProject();
  const { updateProject } = useUpdateProject();

  const { projectData } = useProject(projectId);
  const { users } = useNormalizedUsers();

  const projectName = projectId ? (projectData?.name as string) : 'New project';

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <NewProjectStep projectName={projectName} />;
      case 1:
        return <TeamStep />;
      case 2:
        return <SummaryStep />;
      default:
        return <Loader />;
    }
  };

  const initialValues = {
    [CreateProjectFields.Type]: projectId
      ? projectData?.type
      : Enum_Project_Type.TimeMaterial,
    [CreateProjectFields.Name]: projectId ? projectData?.name : '',
    [CreateProjectFields.Client]: projectId ? projectData?.client : '',
    [CreateProjectFields.Start]: projectId
      ? new Date(projectData?.start)
      : new Date(),
    [CreateProjectFields.End]: projectId
      ? new Date(projectData?.end)
      : addYears(new Date(), 1),
    [CreateProjectFields.Managers]: projectId
      ? projectData?.managers?.data[0].id
      : '',
    [CreateProjectFields.Salary]: projectId
      ? projectData?.salary?.map((el) => {
          const user = users?.find(
            (user) =>
              user.attributes?.lastName ===
              el?.users?.data?.attributes?.lastName
          );

          return { users: user?.id, rate: el?.rate };
        })
      : [],
    [CreateProjectFields.Users]: projectId
      ? projectData?.salary?.map((el) => {
          const user = users?.find(
            (user) =>
              user.attributes?.lastName ===
              el?.users?.data?.attributes?.lastName
          );

          return user?.id;
        })
      : [],
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
    [CreateProjectFields.Managers]: yup
      .string()
      .required('Should not be empty'),
    [CreateProjectFields.Users]: yup.array().min(1, 'Minimum one employee'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: projectId ? true : false,
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
      if (projectId) {
        updateProject(projectId, data, values[CreateProjectFields.Name]).then(
          () => {
            setIsCreateProject(false);
          }
        );
      }
      if (!projectId) {
        createProject(data, values[CreateProjectFields.Name]).then(() => {
          setIsCreateProject(false);
        });
      }
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
        <Typography variant="h1">{projectStatus}</Typography>
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
                  onClick={() => setIsCreateProject(false)}
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
