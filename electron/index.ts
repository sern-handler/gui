import * as path from 'node:path'
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as isDev from 'electron-is-dev';
import * as fs from 'fs';
import * as colorette from 'colorette';
import { exec } from 'node:child_process';

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
		icon: './icons/icon.png',
		show: false,
		autoHideMenuBar: true,
		title: 'sern',
	});
	if (isDev) {
		mainWindow.loadURL('http://localhost:5173');
	} else {
		mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
	}

	mainWindow.on('ready-to-show', () => {
		mainWindow.show();
	});

	mainWindow.on('page-title-updated', function (e) {
		e.preventDefault();
	});

	ipcMain.on('openFolder', (event, _arg) => {
		dialog
		  .showOpenDialog({
			properties: ['openDirectory'],
		  })
		  .then((result) => {
			event.reply('folderData', result.filePaths);
		  })
		  .catch((error) => {
			console.error(error);
			event.reply('folderData', []);
		  });
	});
	
	ipcMain.on('submitForm', async (event, data) => {
		// Process the submitted data here
		console.log(`${colorette.green('✓')} Received sern init submit form data:`)
		console.log(data);
		console.log(`${colorette.cyan('🛈')} Current OS: ${currentOS}`)

		let packageManagerCommand: string
		switch (data.chosenPackageManager) {
			case 'npm':
				packageManagerCommand = `npm create @sern/bot@latest -- --template=${data.chosenTemplate} --name="${data.projectName}" --install=npm`
				break;
			case 'yarn':
				packageManagerCommand = `npm create @sern/bot@latest -- --template=${data.chosenTemplate} --name="${data.projectName}" --install=yarn`
				break;
			case 'pnpm':
				packageManagerCommand = `npm create @sern/bot@latest -- --template=${data.chosenTemplate} --name="${data.projectName}" --install=pnpm`
				break;
			default:
				packageManagerCommand = `npm create @sern/bot@latest -- --template=${data.chosenTemplate} --name="${data.projectName}"`
				break;
		}
		let commandToRun: string
		switch (currentOS) {
			case 'linux':
				commandToRun = `cd ${data.selectedPath};${packageManagerCommand}`
				break;
			case 'windows':
				commandToRun = `cd /D ${data.selectedPath} && ${packageManagerCommand}`
				break;
			case 'macOS':
				commandToRun = `cd ${data.selectedPath};${packageManagerCommand}`
				break;
			default:
				// defaulting for linux (most probable command syntax)
				commandToRun = `cd ${data.selectedPath};${packageManagerCommand}`
				break;
		}

		console.log(`${colorette.cyan('🛈')} About to execute command: ${commandToRun}`)
		const cmd = exec(commandToRun)

		cmd.stdout!.on('data', (data) => {
			console.log(`${colorette.cyan('🛈')} Command stdout: ${data}`);
		});

		cmd.stderr!.on('data', (data) => {
			console.error(`${colorette.red('×')} Command stderr: ${data}`);
		});

		cmd.on('close', (code) => {
			console.log(`${colorette.cyan('🛈')} Command exited with status code ${code}. Now notifying frontend...`);
			event.reply('submitForm')
		});
	});
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

let currentOS: string
switch (process.platform) {
	case 'linux':
		currentOS = 'linux'
		break;
	case 'win32':
		currentOS = 'windows'
		break;
	case 'darwin':
		currentOS = 'macOS'
		break;
	default:
		// defaulting for linux (most probable command syntax)
		currentOS = 'linux'
		break;
}

const asciiart = `         .:-=-:.         
.:=+++++++++=-.     
:-=+++++++++++++++++=-: 
=++++++++++++++++++++=:.      
=+++++++++++++++=-:           
=++++++++++++-.               ######  ######## ########  ##    ##     ######   ##     ## #### 
=++++++++++++*+=:.            ##    ## ##       ##     ## ###   ##    ##    ##  ##     ##  ##  
=++++++++++++******=-.        ##       ##       ##     ## ####  ##    ##        ##     ##  ##  
:=+++++++++++**********+-      ######  ######   ########  ## ## ##    ##   #### ##     ##  ##  
.:-+++++++********###*           ## ##       ##   ##   ##  ####    ##    ##  ##     ##  ##  
   :-=++***########*     ##    ## ##       ##    ##  ##   ###    ##    ##  ##     ##  ##  
	 .-*###########*      ######  ######## ##     ## ##    ##     ######    #######  #### 
 :=+###############*     
.-=*###################*     
.:=*#################*=-.
:=+#########+=:     
`
console.log(asciiart)