import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function FunctionalityCard({ command, description }) {
  return (
    <Card sx={{ width: window.innerWidth / 2 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {description}
        </Typography>
        <Typography color="text.primary">
          <code>~$ sern {command}</code>
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Get started</Button>
      </CardActions>
    </Card>
  );
}