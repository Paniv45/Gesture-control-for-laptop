// commandExecutor.js

const { exec } = require('child_process');

let isCommandExecuting = false;
let lastExecutedCommand = null;

const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    if (isCommandExecuting) {
      console.log('A command is already executing. Ignoring new command.');
      return resolve();
    }

    isCommandExecuting = true;

    exec(command, (error, stdout, stderr) => {
      isCommandExecuting = false;
      if (error) {
        console.error(`Error executing command: ${error}`);
        return reject(error);
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      resolve(stdout);
    });
  });
};

// Use PowerShell commands for various actions
const actionToCommand = {
  OPEN_CHROME: 'powershell.exe -Command "Start-Process \'chrome.exe\'"',
  OPEN_FILE_EXPLORER: 'powershell.exe -Command "Start-Process explorer.exe"',
  PLAY_PAUSE_MEDIA: 'powershell.exe -Command "[System.Windows.Forms.SendKeys]::SendWait(\' \')"',
  CLOSE_TAB: 'powershell.exe -Command "[System.Windows.Forms.SendKeys]::SendWait(\'^w\')"',
  OPEN_YOUTUBE: 'powershell.exe -Command "Start-Process \'chrome.exe\' https://www.youtube.com"',
  SHUT_DOWN_WINDOW: 'shutdown /s /t 0', // Shuts down Windows immediately
};

const executeAction = async (action) => {
  // Check if the current action is the same as the last executed command
  if (action === lastExecutedCommand) {
    console.log('Same action as last executed. Ignoring.');
    return;
  }

  const command = actionToCommand[action];
  if (command) {
    try {
      await executeCommand(command);
      lastExecutedCommand = action; // Update last executed command
    } catch (error) {
      console.error('Error executing action:', error);
    }
  } else {
    console.log('No command mapped for action:', action);
  }
};

module.exports = { executeAction };
