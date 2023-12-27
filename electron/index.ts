import * as path from 'node:path'
import { app, BrowserWindow, dialog, ipcMain, ipcRenderer } from 'electron';
import * as colorette from 'colorette';
import * as fs from 'node:fs'
import * as os from 'node:os'
import { exec, spawn } from 'node:child_process';
import getPlatform from './utils/getPlatform.js';
import updateChecker from './updateChecker.js';

async function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
		icon: './icons/icon.png',
		show: false,
		autoHideMenuBar: true,
		title: 'sern',
	});
	if (app.isPackaged) {
		mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
	} else {
		mainWindow.loadURL('http://localhost:5173');
	}

	mainWindow.on('ready-to-show', async () => {
		mainWindow.show();

		ipcMain.on('updateAvailable', async (event) => {
			const checkUpdates = await updateChecker()
			if (checkUpdates) {
				event.reply('updateAvailableResponse', checkUpdates)
			}
		})
		
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
	
	ipcMain.on('submitForm', async (event, data: InitModalData) => {
		const fileName = createRandomFileName('txt')
		// Process the submitted data here
		writeLineToLogAndConsole(`${colorette.green('✓')} Received sern init submit form data:`, fileName);
		writeLineToLogAndConsole(JSON.stringify(data), fileName)
		writeLineToLogAndConsole(`${colorette.cyan('🛈')} Current OS: ${currentOS}`, fileName);

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
		let commandToRun: string;
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

		writeLineToLogAndConsole(`${colorette.cyan('🛈')} About to execute command: ${commandToRun}`, fileName);
		const cmd = exec(commandToRun)

		cmd.stdout!.on('data', (data) => {
			writeLineToLogAndConsole(`${colorette.cyan('🛈')} ${data}`, fileName);
		});

		cmd.stderr!.on('data', (data) => {
			writeLineToLogAndConsole(`${colorette.red('×')} stderr: ${data}`, fileName);
		});

		cmd.on('close', (code) => {
			writeLineToLogAndConsole(`${colorette.cyan('🛈')} Command exited with status code ${code}. Now notifying frontend...`, fileName);
			event.reply('submitForm', { exitCode: code, logFileName: fileName })
		});
	});

	ipcMain.on('openTxtFile', (event, args) => {
		openTempTextFile(args)
		event.reply('openTxtFile')
	})
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

const currentOS = getPlatform()

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

// from now on will be functions that are used in the above code

function createRandomFileName(extension: string) {
	return `sern-gui-${randomstring(8)}.${extension}`
}

function writeLineToLogAndConsole(text: string, logfilename: string) {
	console.log(text)
	fs.appendFileSync(`${os.tmpdir()}/${logfilename}`, `\n${text}`, { encoding: 'utf-8' })
}

function openTempTextFile(filename: string) {
	const completeFilename = `${os.tmpdir()}/${filename}`
	switch (currentOS) {
		case 'macOS':
			return spawn('open', [completeFilename])
		case 'windows':
			return spawn('notepad', [completeFilename])
		case 'linux':
			return spawn('xdg-open', [completeFilename])
	}
}

function randomstring(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
    }
    return result;
}

interface InitModalData {
	projectName: string,
	chosenTemplate: string,
	installPackages: boolean,
	chosenPackageManager: string,
	selectedPath: string
}