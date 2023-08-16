import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import InitModal from './InitModal.js';
import PluginsModal from './PluginsModal.js';
import { useTranslation } from 'react-i18next';

function cardChooser(command: Props) {
  const cmd = command.command
  switch (cmd) {
    case 'init':
      return <InitModal />
    case 'plugins':
      return <PluginsModal />
  }
}

export default function FunctionalityCard(props: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'functionalityCard' });

  const resolveDescription = (command: Props) => {
    const cmd = command.command
    switch (cmd) {
      case 'init':
        return t('init.description')
      case 'plugins':
        return t('plugins.description')
    }
  }

  return (
    <Card sx={{ width: window.innerWidth / 2 }} variant='outlined'>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {resolveDescription(props)}
        </Typography>
        <Typography color="text.primary">
          <code>~$ sern {props.command}</code>
        </Typography>
      </CardContent>
      <CardActions>
        {/*<Button size="small">Get started</Button>*/}
        {cardChooser(props)}
      </CardActions>
    </Card>
  );
}

interface Props {
  command: 'init' | 'plugins'
}