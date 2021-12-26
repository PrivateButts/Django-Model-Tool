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
		if(!model){
			return;
		}

		let fields = model!.fields.map(f => f.name);
		fields.unshift('id');

		let quote = Config.getSetting('FieldListSingleQuote', false) ? '\'' : '"';
		let joinStr = Config.getSetting('FieldListNewLines', false) ? `${quote},\n${quote}` : `${quote}, ${quote}`;

		editor.edit(function(e){
			e.insert(
				editor!.selection.start,
				quote + fields.join(joinStr) + quote
			);
		});
	});
	context.subscriptions.push(genFieldList);

	console.log("Registered");
}

export function deactivate() {}
