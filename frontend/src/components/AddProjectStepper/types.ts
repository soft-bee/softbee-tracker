import { Enum_Project_Type } from 'types/GraphqlTypes';

export enum CreateProjectFields {
  Name = 'name',
  Client = 'client',
  Type = 'type',
  Start = 'start',
  End = 'end',
  Status = 'status',
  Salary = 'salary',
  Manager = 'manager',
  Users = 'users',
}

export type ProjectProps = {
  setIsCreateProject: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: string;
};

export type CreateProjectStep = {
  name: string;
  fields: CreateProjectFields[];
};

export type Salary = {
  users: string;
  rate: number;
};
