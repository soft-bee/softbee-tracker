import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';

import { ProjectsList } from 'components/ProjectsList/ProjectsList';
import { ProjectFilters } from './ProjectFilters';
import { MainWrapper, AddNewProject, TimeInspector } from 'components';
import { Button } from 'legos';
import { useProjects } from 'hooks';
import { PageProps } from 'pages/types';

const ProjectPage: React.FC<PageProps> = ({ title }) => {
  const { projects } = useProjects();
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [managerFilter, setManagerFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('active');
  const [projectId, setProjectId] = useState('');

  const handleSetCreateProject = (value: boolean) => {
    setIsCreateProject(value);
  };

  const onToggleForm = () => {
    setIsCreateProject(!isCreateProject);
    setProjectId('');
  };
  const filteredProjects = projects?.filter(({ attributes }) => {
    if (
      (statusFilter === 'all' || statusFilter === attributes?.status) &&
      attributes?.name.toLowerCase().includes(searchFilter.toLowerCase()) &&
      ((managerFilter.length > 0 &&
        managerFilter.includes(attributes?.manager?.data?.id ?? '')) ||
        managerFilter.length === 0)
    ) {
      return true;
    }
    return false;
  });

  return (
    <MainWrapper
      sidebar={
        <>
          {!isCreateProject && (
            <Button
              sx={{ mb: 2 }}
              fullWidth
              variant="contained"
              title="Add new project"
              size="large"
              onClick={onToggleForm}
            />
          )}
          <TimeInspector />
        </>
      }
    >
      {isCreateProject ? (
        <AddNewProject
          handleSetCreateProject={handleSetCreateProject}
          projectId={projectId}
        />
      ) : (
        <>
          <Typography variant="h1">{title}</Typography>
          <Stack mt={4} spacing={2}>
            <Stack direction="row" spacing={2} mb={4}>
              <ProjectFilters
                searchFilter={searchFilter}
                managerFilter={managerFilter}
                statusFilter={statusFilter}
                onSearchFilterChange={(value) => setSearchFilter(value)}
                onManagerFilterChange={(value) => setManagerFilter(value)}
                onStatusFilterChange={(value) => setStatusFilter(value)}
              />
            </Stack>
            <ProjectsList
              projectsList={filteredProjects}
              setIsCreateProject={setIsCreateProject}
              setProjectId={setProjectId}
            />
          </Stack>
        </>
      )}
    </MainWrapper>
  );
};

export default ProjectPage;
