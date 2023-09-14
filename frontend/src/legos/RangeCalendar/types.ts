export type DefaultRangeDatesItem = {
  label: string;
  value: [Date, Date];
};

export type RangeCalendarProps = {
  selectedDates: Date[];
  setSelectedDates: React.Dispatch<React.SetStateAction<Date[]>>;
  shouldDisableDate?: ((day: Date) => boolean) | undefined;
  defaultRangeDates?: DefaultRangeDatesItem[];
  disablePast?: boolean;
  disableFuture?: boolean;
  maxDate?: Date;
  minDate?: Date;
  isRequestLeave?: boolean;
};
