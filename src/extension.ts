import * as vscode from 'vscode';
import { showModelPicker, compileTemplate } from './ModelTools';
import { Config } from './Config';

export function activate(context: vscode.ExtensionContext) {

	let genModelAdmin = vscode.commands.registerCommand('django-model-tool.generate-model-admin', async () => {
		let editor = vscode.window.activeTextEditor;
		if(!editor){
			return;
		}

		let model = await showModelPicker();
		
		if(model){
			editor.edit(function(e){
				e.insert(
					editor!.selection.start,
						compileTemplate('modelAdmin', model!)
					);
			});
		}
	});
	context.subscriptions.push(genModelAdmin);

	let genFieldList = vscode.commands.registerCommand('django-model-tool.generate-field-list', async () => {
		let editor = vscode.window.activeTextEditor;
		if(!editor){
			return;
		}

		let model = await showModelPicker();
	});
	console.log("Registered");
}

export function deactivate() {}
