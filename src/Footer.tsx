import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import PublicIcon from '@mui/icons-material/Public';
import GitHubIcon from '@mui/icons-material/GitHub';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Footer.css'
import { useTranslation } from 'react-i18next';
const { shell } = window.require('electron');

export default function Footer() {
	const { t } = useTranslation('translation', { keyPrefix: 'footer' });
	return (
		<div className="footer">
			<Typography color="primary" sx={{ cursor: 'pointer' }}>
				{/* this is such a hacky way to do this but it works(tm) */}
				<Link onClick={() => shell.openExternal('https://sern.dev')}>
					<PublicIcon color="primary" sx={{ fontSize: 'inherit', verticalAlign: 'middle', marginRight: '4px' }} />
					<Typography variant="body1" component="span" sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
						{t('web')}
					</Typography>
				</Link>
		
				<span style={{ margin: '0 4px', cursor: 'default' }}>•</span>
		
				<Link onClick={() => shell.openExternal('https://github.com/sern-handler')}>
					<GitHubIcon color="primary" sx={{ fontSize: 'inherit', verticalAlign: 'middle', marginRight: '4px' }} />
					<Typography variant="body1" component="span" sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
						github
					</Typography>
				</Link>
		
				<span style={{ margin: '0 4px', cursor: 'default' }}>•</span>
		
				<Link onClick={() => shell.openExternal('https://discord.gg/sern')}>
					<FontAwesomeIcon icon={faDiscord} style={{ fontSize: 'inherit', verticalAlign: 'middle', marginRight: '4px' }} />
					<Typography variant="body1" component="span" sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
						discord
					</Typography>
				</Link>
			</Typography>
		</div>
	);
}
