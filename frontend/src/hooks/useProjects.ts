import { useQuery } from '@apollo/client';

import { PROJECTS_QUERY } from 'api';
import { breaksSlugs } from 'constant';
import {
  ProjectEntityResponseCollection,
  ProjectFiltersInput,
} from 'types/GraphqlTypes';

export const useProjects = (filters: ProjectFiltersInput = {}) => {
  const { data, loading, refetch } = useQuery<{
    projects: ProjectEntityResponseCollection;
  }>(PROJECTS_QUERY, {
    variables: {
      filters: {
        name: {
          notIn: breaksSlugs.map((s) => s[0].toUpperCase() + s.slice(1)),
        },
        ...filters,
      },
    },
  });

  const projects = data?.projects.data;
  const projectsChoices = projects?.map(({ id, attributes }) => ({
    value: id,
    label: attributes?.name,
  }));

  return {
    projects,
    projectsChoices,
    loading,
    refetch,
  };
};
