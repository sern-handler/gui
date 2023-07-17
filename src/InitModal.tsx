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
import './InitModal.css';
const { ipcRenderer } = window.require('electron');

/* const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #FFF',
  boxShadow: 24,
  padding: '20px',
  color: 'white',
}; */

export default function InitModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [chosenTemplate, setChosenTemplate] = React.useState('');
  const handleTemplateChange = (event: SelectChangeEvent) => {
    setChosenTemplate(event.target.value);
  };

  const [installPackages, setInstallPackages] = React.useState(true);
  const handlePackagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInstallPackages(event.target.checked);
  };

  const [chosenPackageManager, setChosenPackageManager] = React.useState('');
  const handlePackageManagerChange = (event: SelectChangeEvent<string>) => {
    setChosenPackageManager(event.target.value);
  };

  const [templates, setTemplates] = React.useState<Array<TemplateList>>([]);
  React.useEffect(() => {
    fetch('https://raw.githubusercontent.com/sern-handler/create-bot/main/metadata/templateChoices.json')
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  if (templates.length === 0) {
    setTemplates([{ title: "Couldn't fetch templates! Please do CTRL+R", value: 'error' }]);
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

    ipcRenderer.send('submitForm', data);

    ipcRenderer.on('submitForm', () => {
      setLoading(false);
      handleClose();
      ipcRenderer.removeAllListeners('submitForm'); // Remove the listener to avoid memory leaks
    });
  }

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
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
              label="Project name"
              variant="outlined"
              onChange={handleProjectNameChange}
              required
              fullWidth
            />
            <FormControl fullWidth className="chooseTemplateForm">
              <InputLabel id="modal-form-templateLabel">
                Select template
              </InputLabel>
              <Select
                labelId="modal-form-templateSelect"
                id="modal-form-templateSelect"
                value={chosenTemplate}
                label="Select template"
                onChange={handleTemplateChange}
                fullWidth
              >
                {templates.map((template) => (
                  <MenuItem key={template.value} value={template.value}>
                    {template.title}
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
                label="Install packages while you're at it"
              />
            </FormGroup>
            <FormControl className="choosePkgManagerForm" fullWidth>
              <InputLabel id="modal-form-packageManagerLabel">
                Select package manager
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
              Select directory
            </Button>
          </div>
          <div className="formRow">
            <Typography
              variant="body1"
              component="div"
              sx={{ display: 'block', margin: '0 auto', marginTop: '5px' }}
            >
              {selectedPath ? `Selected directory: ${selectedPath}` : ''}
            </Typography>
          </div>
          <div className="formRow">
            <Typography
              variant="body1"
              component="div"
              sx={{
                display: 'block',
                margin: '0 auto',
                marginTop: '5px',
                textAlign: 'center',
              }}
            >
              Do not close the modal while it's loading.
            </Typography>
          </div>
          <div className="bottomRight">
            <Button
              variant="contained"
              component="label"
              onClick={handleSubmit}
              disabled={loading || !isFormValid()}
            >
              {loading ? 'Go!' : 'Go!'}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

interface TemplateList {
  title: string
  value: string
}