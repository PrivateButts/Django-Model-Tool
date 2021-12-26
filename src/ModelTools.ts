import * as vscode from 'vscode';
import { searchForModels, ModelClass } from './Parser';
import { Config } from './Config';

const HANDLEBARS = require("handlebars");


export async function showModelPicker(){
    let models = await searchForModels();
    let modelSelection = await vscode.window.showQuickPick(
        models.map(m => m.name)
    );

    if(!modelSelection){
        return;
    }
    
    return models.find(m => m.name === modelSelection); // TODO: Handle multiple models with the same name
}


export function compileTemplate(templateName: string, templateData: ModelClass){
    let template = Config.getSetting('templates.' + templateName, '');
    if(!template){
        return;
    }

    let compiled = HANDLEBARS.compile(template);
    return compiled(templateData);
}