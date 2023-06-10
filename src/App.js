import './App.css';
import Footer from './Footer.js';
import './FunctionalityCard.js';
import FunctionalityCard from './FunctionalityCard.js';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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
				<h1 className="titleHeader">~$ sern</h1>
				<div className="functionalityCards">
					<FunctionalityCard
						command="init"
						description="Scaffold a new project"
					/>
					<FunctionalityCard
						command="plugins"
						description="Install plugins on your existing project"
					/>
				</div>
				<Footer />
			</ThemeProvider>
		</div>
	);
}

export default App;
