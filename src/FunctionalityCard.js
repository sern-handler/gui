import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import InitModal from './InitModal.js';
import PluginsModal from './PluginsModal.js';

function cardChooser(command) {
  switch (command) {
    case 'init':
      return <InitModal />
    case 'plugins':
      return <PluginsModal />
    default:
      return null
  }
}

export default function FunctionalityCard({ command, description }) {
  return (
    <Card sx={{ width: window.innerWidth / 2 }} variant='outlined'>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {description}
        </Typography>
        <Typography color="text.primary">
          <code>~$ sern {command}</code>
        </Typography>
      </CardContent>
      <CardActions>
        {/*<Button size="small">Get started</Button>*/}
        {cardChooser(command)}
      </CardActions>
    </Card>
  );
}