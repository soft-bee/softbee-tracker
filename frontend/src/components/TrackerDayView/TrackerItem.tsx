import React, { FC, useContext, useState } from 'react';
import {
  Button,
  IconButton,
  Input,
  Popper,
  Typography,
  ClickAwayListener,
  Stack,
} from '@mui/material';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { TimeContext } from './TrackerDayView';
import { parseTrackerTime } from 'helpers';
import { Maybe, Tracker } from 'types/GraphqlTypes';

type Props = {
  id: Maybe<string> | undefined;
  attributes: Maybe<Tracker> | undefined;
  trackerTime: Date;
};

export const TrackerItem: FC<Props> = ({ id, attributes, trackerTime }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isTrackerStart, setIsTrackerStart] = useState(false);
  const [isPopperOpen, setIsPopperOpen] = useState(false);

  const [time, setTime] = useState(trackerTime);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { onUpdateTracker, onDeleteTracker } = useContext(TimeContext);

  const handleBlur = () => {
    onUpdateTracker(time, id);
    setIsEdit(!isEdit);
  };

  const handleChange = (value: string) => {
    setTime(parseTrackerTime(value, 'HH:mm'));
  };

  const onHaldlerTime = (detail: number) => {
    if (detail === 2) setIsEdit(!isEdit);
  };

  const handleClickDeleteButton = (el: HTMLElement) => {
    setAnchorEl(anchorEl ? null : el);
    setIsPopperOpen(true);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
    setIsPopperOpen(false);
  };

  const handleDelete = () => {
    handleClickAway();
    onDeleteTracker(id);
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      gap={3}
      borderBottom={1}
      borderColor="gray"
      py={4}
    >
      <Stack>
        <Typography variant="h6">
          {attributes?.project?.data?.attributes?.name}
        </Typography>
        <Typography>{attributes?.description}</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" gap={1}>
        {isEdit ? (
          <Input
            type="time"
            value={format(time, 'HH:mm:ss.SSS')}
            onBlur={handleBlur}
            onChange={(e) => handleChange(e.target.value)}
            onClick={(e) => onHaldlerTime(e.detail)}
          />
        ) : (
          <Typography
            sx={{ userSelect: 'none' }}
            onClick={(e) => onHaldlerTime(e.detail)}
          >
            {format(time, 'HH:mm')}
          </Typography>
        )}
        <IconButton color="primary" onClick={() => setIsEdit(!isEdit)}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="large"
          color="primary"
          sx={{ border: '1px solid' }}
          onClick={() => setIsTrackerStart(!isTrackerStart)}
        >
          {isTrackerStart ? (
            <PauseIcon fontSize="inherit" />
          ) : (
            <PlayArrowIcon fontSize="inherit" />
          )}
        </IconButton>
        <IconButton
          color="error"
          onClick={(e) => handleClickDeleteButton(e.currentTarget)}
        >
          <DeleteOutlineIcon />
        </IconButton>
        {isPopperOpen && (
          <ClickAwayListener onClickAway={handleClickAway}>
            <Popper open={isPopperOpen} anchorEl={anchorEl}>
              <Stack
                bgcolor="background.paper"
                border="1px solid"
                borderRadius={1}
                p={2}
              >
                <Typography marginBottom={2}>
                  Are you sure to delete this timesheet?
                </Typography>
                <Stack direction="row" justifyContent="flex-end" gap={2}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleClickAway}
                  >
                    No
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={handleDelete}
                  >
                    Yes
                  </Button>
                </Stack>
              </Stack>
            </Popper>
          </ClickAwayListener>
        )}
      </Stack>
    </Stack>
  );
};
