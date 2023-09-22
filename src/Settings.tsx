import './Settings.css';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import SettingsIcon from '@mui/icons-material/Settings';
import Checkbox from '@mui/material/Checkbox';
import { useTranslation } from 'react-i18next';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { Profiler } from 'react';
import ComponentLoadTimeWidget from './ComponentLoadTimeWidget';

export default function Settings() {
	const [CLTW, setCLTW] = React.useState({ show: false, ad: 0, bd: 0 })
	const onRender = (_id: string, _phase: string, actualDuration: number, baseDuration: number, _startTime: EpochTimeStamp, _commitTime: EpochTimeStamp) => {
		if (!!window.localStorage.getItem('componentLoadTimes')) {
			setCLTW({
				show: true,
				ad: actualDuration,
				bd: baseDuration
			})
		}
	}

	const { t } = useTranslation('translation', { keyPrefix: 'settings' });
	const [state, setState] = React.useState({
		componentLoadTimes: !!window.localStorage.getItem('componentLoadTimes')
	});
	const { componentLoadTimes } = state;

	const [open, setOpen] = React.useState(false);
	const handleModalOpen = () => setOpen(true);
	const handleModalClose = () => setOpen(false);

	const handleButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setState({ ...state, [event.target.name]: event.target.checked });
		switch (event.target.name) {
			case 'componentLoadTimes':
				return window.localStorage.setItem('componentLoadTimes', event.target.checked.toString())
		}
		console.log(state)
	}

	return (
		<div>
			<SettingsIcon onClick={handleModalOpen} color={'primary'} />
			<Profiler onRender={onRender} id={'settings-modal'}>
				<ComponentLoadTimeWidget state={CLTW} />
				<Modal
					open={open}
					onClose={handleModalClose}
					aria-labelledby="settings-modal-title"
					aria-describedby="settings-modal-description"
				>
					<Box className={'boxStyle'} sx={{ bgcolor: 'background.paper' }}>
						<FormGroup>
							<Typography variant="h5" gutterBottom>
								Debugging
							</Typography>
							<FormControlLabel
								control={
									<Checkbox checked={componentLoadTimes} onChange={handleButtonChange} name="componentLoadTimes" />
								}
								label={t('componentLoadTimes')}
							/>
						</FormGroup>
					</Box>
				</Modal>
			</Profiler>
		</div>
	)
}