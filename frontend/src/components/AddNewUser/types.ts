export enum CreateUserFields {
  FirstName = 'firstName',
  LastName = 'lastName',
  Email = 'email',
  Position = 'position',
  DateEmployment = 'dateEmployment',
  Phone = 'phone',
  SalaryInfo = 'salaryInfo',
  Password = 'password',
  UserName = 'username',
  Сonfirmed = 'confirmed',
}

export type UserProps = {
  setIsCreateUser: React.Dispatch<React.SetStateAction<boolean>>;
};
