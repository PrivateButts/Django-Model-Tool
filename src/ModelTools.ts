import * as vscode from 'vscode';
import { searchForModels, ModelClass } from './Parser';
import { Config } from './Config';

const HANDLEBARS = require("handlebars");


interface ModelQuickPickItem extends vscode.QuickPickItem {
    model: ModelClass
}

function modelQuickPickItems(models: ModelClass[]): ModelQuickPickItem[] {
    // Convert to ModelQuickPickItem[]
    let qpis = models.map(m => {
        return {
            label: m.name,
            description: m.parentFolderName,
            model: m
        };
    });

    // Sort by description (parentName), then label (name)
    qpis.sort((a, b) => {
        if(a.description < b.description){
            return -1;
        }else if (a.description > b.description){
            return 1;
        }else{
            if(a.label < b.label){
                return -1;
            }else if(a.label > b.label){
                return 1;
            }else{
                return 0;
            }
        }
    });

    // Shift models in same folder to the top
    if(Config.getSetting('PreferModelsInSameFolder', true)){
        let currentFolderName = vscode.window.activeTextEditor?.document.fileName.split('/').slice(-2)[0];
        qpis.sort((a, b) => {
            if(a.model.parentFolderName === currentFolderName && b.model.parentFolderName !== currentFolderName){
                return -1;
            }else if(b.model.parentFolderName === currentFolderName && a.model.parentFolderName !== currentFolderName){
                return 1;
            }else{
                return 0;
            }
        });
    }

    return qpis;
}


export async function showModelPicker(){
    let models = await searchForModels();

    let modelSelection = await vscode.window.showQuickPick(modelQuickPickItems(models));

    if(!modelSelection){
        return;
    }
    
    return modelSelection.model;
}


export function compileTemplate(templateName: string, templateData: ModelClass){
    let template = Config.getSetting('templates.' + templateName, '');
    if(!template){
        return;
    }

    let compiled = HANDLEBARS.compile(template);
    return compiled(templateData);
}