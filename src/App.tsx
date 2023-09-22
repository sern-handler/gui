import './App.css';
import Footer from './Footer.js';
import './FunctionalityCard.js';
import FunctionalityCard from './FunctionalityCard.js';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LanguageSelector from './LanguageSelector';
import Settings from './Settings';

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#C9426E'
		}
	},
});

function App() {
	return (
		<div className="App">
			<ThemeProvider theme={darkTheme}>
				<Settings />
				<LanguageSelector />
				<h1 className="titleHeader">~$ sern</h1>
				<div className="functionalityCards">
					<FunctionalityCard
						command="init"
					/>
					<FunctionalityCard
						command="plugins"
					/>
				</div>
				<Footer />
			</ThemeProvider>
		</div>
	);
}

export default App;
