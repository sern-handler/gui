import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import PublicIcon from '@mui/icons-material/Public';
import GitHubIcon from '@mui/icons-material/GitHub';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Footer.css'

export default function Footer() {
	return (
		<div className="footer">
			<Typography color="primary">
				<Link href="https://sern.dev">
				<PublicIcon color="primary" sx={{ fontSize: 'inherit', verticalAlign: 'middle', marginRight: '4px' }} />
				<Typography variant="body1" component="span" sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
					front page
				</Typography>
				</Link>
		
				<span style={{ margin: '0 4px' }}>•</span>
		
				<Link href="https://github.com/sern-handler">
				<GitHubIcon color="primary" sx={{ fontSize: 'inherit', verticalAlign: 'middle', marginRight: '4px' }} />
				<Typography variant="body1" component="span" sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
					github
				</Typography>
				</Link>
		
				<span style={{ margin: '0 4px' }}>•</span>
		
				<Link href="https://sern.dev/discord">
				<FontAwesomeIcon icon={faDiscord} style={{ fontSize: 'inherit', verticalAlign: 'middle', marginRight: '4px' }} />
				<Typography variant="body1" component="span" sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
					discord
				</Typography>
				</Link>
			</Typography>
		</div>
	);
}
