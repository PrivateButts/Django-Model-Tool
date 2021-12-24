import * as vscode from 'vscode';

export class Config {
    static getConfig(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration('django-model-tool');
    }
    static getSetting(key: string, defaultValue: any): any {
        return Config.getConfig().get(key, defaultValue);
    }
}