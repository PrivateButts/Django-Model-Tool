import * as vscode from 'vscode';

interface ModelClass {
    name: string
    parentName: string
    fileUri: string
    fields: vscode.DocumentSymbol[]
}

async function searchForModels(){
    let modelFiles = await vscode.workspace.findFiles("**/models.py");
    let results: ModelClass[] = [];
    for (const uri of modelFiles){
        let classes = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>("vscode.executeDocumentSymbolProvider", uri);
        if(classes){
            classes.forEach(c => {
                if(c.kind === 4){
                    let parsed: ModelClass = {
                        name: c.name,
                        parentName: uri.path.split('/')[uri.path.split('/').length - 2],
                        fileUri: uri.fsPath,
                        fields: c.children.filter(f => f.kind === 12)
                    };
                    results.push(parsed);
                }
            });
        }
    }
    // console.log(results);
    return results;
}

export { searchForModels };