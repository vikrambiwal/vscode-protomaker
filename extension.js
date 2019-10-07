// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { searchIn } = require('./main');

const vscode = require('vscode');
const editor = vscode.window.activeTextEditor;
var path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "protomaker" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.protoMaker', function() {
		// The code you place here will be executed every time your command is executed

		const text = editor.document.getText(editor.selection);
		var currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
		var currentlyOpenTabfileName = path
			.basename(currentlyOpenTabfilePath)
			.split('.')
			.slice(0, -1)
			.join('.');
		searchIn(currentlyOpenTabfilePath, currentlyOpenTabfileName);
		// Display a message box to the use
		vscode.window.showInformationMessage(currentlyOpenTabfilePath, currentlyOpenTabfileName);
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
};
