import './LanguageSelector.css'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
	const { i18n } = useTranslation();
	return (
		<div className="languageSelector">
			<FormControl fullWidth>
				<InputLabel id="lang-select-label" />
				<Select
					labelId="lang-select-label"
					id="lang-select"
					defaultValue={i18n.language}
					label=""
					onChange={(event) => {
						i18n.changeLanguage(event.target.value);
						window.localStorage.setItem('lang', event.target.value);
					}}
					inputProps={{ IconComponent: () => null, sx: { padding: '0 !important' } }}
					sx={{
						height: '40px',
						textAlign: 'center',
						// this fixes a little text selection gap that appears in a
						// few pixels outside the outer part of the selection outline
						cursor: 'pointer',
						fontFamily: 'Noto Color Emoji'
					}}
				>
					<MenuItem value={'en'} className={'menuItems'} sx={{ fontFamily: 'Noto Color Emoji' }}>🇺🇸</MenuItem>
					<MenuItem value={'es'} className={'menuItems'} sx={{ fontFamily: 'Noto Color Emoji' }}>🇪🇸</MenuItem>
					<MenuItem value={'tr'} className={'menuItems'} sx={{ fontFamily: 'Noto Color Emoji' }}>🇹🇷</MenuItem>
				</Select>
			</FormControl>
		</div>
	);
}
