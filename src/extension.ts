// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// Spawn a child process
import { spawn, exec } from "child_process";
import path from "path";

// Path to the UAsset Editor
let uassetCLIPath: string = "";

function convert(path: string, type: boolean) {
  if (!path) {
    return;
  }
  try {
    exec(
      `${uassetCLIPath} ${type ? "-j" : "-u"} "${path}"`,
      (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        if (error) {
          vscode.window.showErrorMessage(`An error occured: ${error}`);
          console.error(`exec error: ${error}`);
        } else {
          vscode.window.showInformationMessage(`Conversion successful!`);
		  if (type) {
			vscode.workspace.openTextDocument(path.replace(".uasset", ".json")).then(doc => {
				// Show the document and format it
				vscode.window.showTextDocument(doc).then(editor => {
					// execute format command
					vscode.commands.executeCommand('editor.action.formatDocument');
				})
			})
        }
      }}
    );

  } catch (error) {
    console.error(error);
  }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  uassetCLIPath = vscode.Uri.joinPath(
    context.extensionUri,
    "assets",
    "cli",
    "UAssetCLITool.exe"
  ).fsPath;
  let disposable = vscode.commands.registerCommand(
    "uassetconverter.touasset",
    (uri: vscode.Uri) => {
      convert(uri.fsPath, false);
    }
  );
  context.subscriptions.push(disposable);
  let disposable2 = vscode.commands.registerCommand(
    "uassetconverter.tojson",
    (uri: vscode.Uri) => {
      convert(uri.fsPath, true);
    }
  );
  context.subscriptions.push(disposable2);
}

// This method is called when your extension is deactivated
export function deactivate() {}
