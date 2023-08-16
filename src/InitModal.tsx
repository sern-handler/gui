import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import type { IpcRendererEvent } from 'electron'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import './InitModal.css';
import { useTranslation } from 'react-i18next';
const { ipcRenderer } = window.require('electron');

export default function InitModal() {
  const { t } = useTranslation('translation', { keyPrefix: 'initModal' });

  const [loadingBecauseItsSettingUp, setLoadingBecauseItsSettingUp] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (loadingBecauseItsSettingUp) return;
    setOpen(false)
  }

  const [chosenTemplate, setChosenTemplate] = React.useState('');
  const handleTemplateChange = (event: SelectChangeEvent) => {
    setChosenTemplate(event.target.value);
  };

  const [installPackages, setInstallPackages] = React.useState(true);
  const handlePackagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInstallPackages(event.target.checked);
  };

  const [chosenPackageManager, setChosenPackageManager] = React.useState('');
  const handlePackageManagerChange = (event: SelectChangeEvent) => {
    setChosenPackageManager(event.target.value);
  };

  const [templates, setTemplates] = React.useState<Array<TemplateList>>([]);
  React.useEffect(() => {
    fetch('https://raw.githubusercontent.com/sern-handler/create-bot/main/metadata/templateChoices.jso')
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data as TemplateList[]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  if (templates.length === 0) {
    setTemplates([{ title: t('couldntFetchTemplates'), value: 'error' }]);
  }

  const [selectedPath, setSelectedPath] = React.useState('');

  const handleChooseDirButton = () => {
    ipcRenderer.send('openFolder');
  };

  const [projectName, setProjectName] = React.useState('');
  const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  };

  React.useEffect(() => {
    ipcRenderer.on('folderData', handleFolderData);

    return () => {
      ipcRenderer.removeListener('folderData', handleFolderData);
    };
  }, []);

  const handleFolderData = (_event: IpcRendererEvent, paths: string[]) => {
    const selectedPath = paths && paths.length > 0 ? paths[0] : '';
    setSelectedPath(selectedPath);
  };

  const [logFileName, setLogFileName] = React.useState('')

  const handleOpenLogFile = () => {
    ipcRenderer.send('openTxtFile', logFileName);

    ipcRenderer.on('openTxtFile', (_event, _args) => {
      ipcRenderer.removeAllListeners('openTxtFile');
    });
  }

  const [successSnackbarOpen, setSuccessSnackbarOpen] = React.useState(false)
  const handleSuccessSnackbarClose = () => setSuccessSnackbarOpen(false);

  const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false)
  const handleErrorSnackbarClose = () => setErrorSnackbarOpen(false);

  const snackbarAction = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleOpenLogFile}>
        {t('openLogFile')}
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const [loading, setLoading] = React.useState(false);

  const isFormValid = () => {
    return projectName !== '' && selectedPath !== '';
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      return;
    }

    const data = {
      projectName,
      chosenTemplate,
      installPackages,
      chosenPackageManager,
      selectedPath,
    };

    setLoading(true);
    setLoadingBecauseItsSettingUp(true)

    ipcRenderer.send('submitForm', data);

    ipcRenderer.on('submitForm', (_event, args: IPCCommandExitEvent) => {
      setLoading(false);
      setLoadingBecauseItsSettingUp(false);
      handleClose();
      setLogFileName(args.logFileName)
      if (args.exitCode === 0) {
        setSuccessSnackbarOpen(true)
      } else {
        setErrorSnackbarOpen(true)
      }
      ipcRenderer.removeAllListeners('submitForm');
    });
  }

  return (
    <div>
      <Button onClick={handleOpen}>{t('openModalButton')}</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="boxStyle" sx={{ bgcolor: 'background.paper' }}>
          <Typography id="modal-modal-title" variant="h1" component="h1">
            ~$ sern init
          </Typography>
          <div className="formRow">
            <TextField
              id="modal-form-projectName"
              label={t('projectName')}
              variant="outlined"
              onChange={handleProjectNameChange}
              required
              fullWidth
            />
            <FormControl fullWidth className="chooseTemplateForm">
              <InputLabel id="modal-form-templateLabel">
                {t('selectTemplate')}
              </InputLabel>
              <Select
                labelId="modal-form-templateSelect"
                id="modal-form-templateSelect"
                value={chosenTemplate}
                label={t('selectTemplate')}
                onChange={handleTemplateChange}
                fullWidth
              >
                {templates.map((template) => (
                  <MenuItem key={template.value} value={template.value}>
                    {template.title.replace('with', t('with'))}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="formRow">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={installPackages}
                    onChange={handlePackagesChange}
                  />
                }
                label={t('installPackagesCheckbox')}
              />
            </FormGroup>
            <FormControl className="choosePkgManagerForm" fullWidth>
              <InputLabel id="modal-form-packageManagerLabel">
                {t('selectPackageManager')}
              </InputLabel>
              <Select
                labelId="modal-form-packageManagerLabel"
                id="modal-form-packageManagerSelect"
                value={chosenPackageManager}
                label="Select package manager"
                onChange={handlePackageManagerChange}
                disabled={!installPackages}
                required={installPackages}
              >
                <MenuItem value="npm">npm</MenuItem>
                <MenuItem value="yarn">yarn</MenuItem>
                <MenuItem value="pnpm">pnpm</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="formRow">
            <Button
              variant="outlined"
              component="label"
              onClick={handleChooseDirButton}
              sx={{ display: 'block', margin: '0 auto', marginTop: '5px' }}
            >
              {t('chooseDirectoryButton')}
            </Button>
          </div>
          <div className="formRow">
            <Typography
              variant="body1"
              component="div"
              sx={{ display: 'block', margin: '0 auto', marginTop: '5px' }}
            >
              {selectedPath ? `${t('selectedDirectory')} ${selectedPath}` : ''}
            </Typography>
          </div>
          <div className="bottomRight">
            <Button
              variant="contained"
              component="label"
              onClick={handleSubmit}
              disabled={loading || !isFormValid()}
            >
              {/*{ loading ? 'Go!' : 'Go!' }*/}
              {t('goButton')}
            </Button>
          </div>
        </Box>
      </Modal>
      <Snackbar open={successSnackbarOpen} autoHideDuration={5000} onClose={handleSuccessSnackbarClose} action={snackbarAction}>
          <Alert onClose={handleSuccessSnackbarClose} severity="success" sx={{ width: '100%' }} action={snackbarAction}>
            {t('commandSuccessful')}
          </Alert>
      </Snackbar>
      <Snackbar open={errorSnackbarOpen} autoHideDuration={5000} onClose={handleErrorSnackbarClose} action={snackbarAction}>
          <Alert onClose={handleErrorSnackbarClose} severity="error" sx={{ width: '100%' }} action={snackbarAction}>
            {t('commandFailed')}
          </Alert>
      </Snackbar>
    </div>
  );
}

interface TemplateList {
  title: string
  value: string
}

interface IPCCommandExitEvent {
  exitCode: number | null
  logFileName: string
}