import React, { ChangeEvent } from 'react';

import { Typography, Box, Button } from '@mui/material';
import { Avatar } from 'legos';

type AvatarUploadProps = {
  avatar: Blob | MediaSource;
  firstName: string;
  lastName: string;

  onChange: (data: ChangeEvent) => void;
};

export const AvatarUpload = ({
  avatar,
  firstName,
  lastName,
  onChange,
}: AvatarUploadProps) => {
  const path = avatar ? `https://dev.strapi.track.softbee.io${avatar}` : '';
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Avatar
        width={180}
        height={180}
        firstName={firstName}
        lastName={lastName}
        avatar={path}
      />
      <Button component="label" color="primary" aria-label="upload picture">
        <Typography fontSize={12}>Upload new photo</Typography>
        <input hidden accept="image/*" type="file" onChange={onChange} />
      </Button>
    </Box>
  );
};
