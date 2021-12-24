import * as vscode from 'vscode';
import { searchForModels } from './Parser';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('django-model-tool.show-models', () => {
		searchForModels();
	});
	context.subscriptions.push(disposable);


	let genModelAdmin = vscode.commands.registerCommand('django-model-tool.generate-model-admin', async () => {
		let editor = vscode.window.activeTextEditor;
		if(!editor){
			return;
		}

		let models = await searchForModels();
		let modelSelection = await vscode.window.showQuickPick(
			models.map(m => m.name)
		);

		if(!modelSelection){
			return;
		}
		
		let model = models.find(m => m.name === modelSelection);
		if(modelSelection){
			editor.edit(function(e){
				e.insert(
					editor!.selection.start,
					`
@admin.register(${modelSelection})
class ${modelSelection}Admin(admin.ModelAdmin):
	list_display = (
		'id',
		'${model!.fields.map(f => f.name).join("',\n\t\t'")}',
	)

`);
			});
		}
	});
	context.subscriptions.push(genModelAdmin);

	console.log("Registered");
}

export function deactivate() {}
