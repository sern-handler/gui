import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CardActions from '@mui/material/CardActions';
import './modalStyles.css';
const { ipcRenderer } = window.require('electron')

// eslint-disable-next-line no-unused-vars
const style = {
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
};

export default function InitModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [chosenTemplate, setChosenTemplate] = React.useState('');
  const handleTemplateChange = (event) => {
    setChosenTemplate(event.target.value);
  };

  const [installPackages, setInstallPackages] = React.useState(true);
  const handlePackagesChange = (event) => {
    setInstallPackages(event.target.checked);
  };

  const [chosenPackageManager, setChosenPackageManager] = React.useState('');
  const handlePackageManagerChange = (event) => {
    setChosenPackageManager(event.target.value);
  };

  const [templates, setTemplates] = React.useState([]);
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

  React.useEffect(() => {
    ipcRenderer.on('folderData', handleFolderData);

    return () => {
      ipcRenderer.removeListener('folderData', handleFolderData);
    };
  }, []);

  const handleFolderData = (event, paths) => {
    const selectedPath = paths && paths.length > 0 ? paths[0] : '';
    setSelectedPath(selectedPath);
  };

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
					<Typography
						id="modal-modal-title"
						variant="h1"
						component="h1"
					>
						~$ sern init
					</Typography>
					<div className="formRow">
						<TextField
							id="modal-form-projectName"
							label="Project name"
							variant="outlined"
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
									<MenuItem
										key={template.value}
										value={template.value}
									>
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
								fullWidth
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
							>
								<MenuItem value="npm">npm</MenuItem>
								<MenuItem value="yarn">yarn</MenuItem>
								<MenuItem value="pnpm">pnpm</MenuItem>
							</Select>
						</FormControl>
					</div>
					<div className="formRow">
          <Button
            variant="contained"
            component="label"
            onClick={handleChooseDirButton}
            sx={{ display: 'block', margin: '0 auto', marginTop: '20px' }}
          >
            Select directory
          </Button>
					{/* <Typography variant="body1" component="div">
            Selected directory: {selectedPath}
          </Typography> */}
					</div>
				</Box>
			</Modal>
		</div>
  );
}
