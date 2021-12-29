import { TextDecoder } from 'util';
import * as vscode from 'vscode';


export interface ModelField {
    name: string;
    type: string | null;
    symbol: FixedDocumentSymbol;
}

export interface ModelClass {
    name: string
    parentFolderName: string
    parentClass: string
    fileUri: string
    fields: ModelField[]
    properties: vscode.DocumentSymbol[]
}

interface FixedDocumentSymbol extends vscode.DocumentSymbol {
    location: vscode.Location
}


async function getParentClass(location: vscode.Location, name: string): Promise<string | null> {
    let searchString = new RegExp(`class\\s+${name}\\((.*)\\)`);
    let raw = await vscode.workspace.fs.readFile(location.uri);
    let contents = new TextDecoder().decode(raw);
    let scopedContent = contents.split('\n').slice(location.range.start.line, location.range.end.line + 1).join('\n');
    let matches = searchString.exec(scopedContent);

    if(matches){
        return matches![1];
    }else{
        return null;
    }
}


async function getFieldType(location: vscode.Location, name: string): Promise<string | null> {
    let searchString = new RegExp(`${name}\\s*=\\s*(.+)\\(`);
    let raw = await vscode.workspace.fs.readFile(location.uri);
    let contents = new TextDecoder().decode(raw);
    let matches = searchString.exec(contents.split('\n')[location.range.start.line]);

    if(matches){
        return matches[1];
    }else{
        return null;
    }
}


export async function searchForModels(): Promise<ModelClass[]> {
    let modelFiles = await vscode.workspace.findFiles("**/*.py");
    let results: ModelClass[] = [];
    let abstracts: {[name: string]: ModelClass} = {};
    
    for (const uri of modelFiles){
        let classes = await vscode.commands.executeCommand<FixedDocumentSymbol[]>("vscode.executeDocumentSymbolProvider", uri);
        if(classes){
            // Parse all classes
            classes.forEach(async c => {
                if(c.kind === 4){
                    // Determine what the class is extending
                    let parentClass = await getParentClass(c.location, c.name);
                    if(parentClass === null){
                        return;
                    }

                    if(parentClass === "models.Manager"){
                        return;
                    }

                    // Is this an abstract class?
                    let abstract = c.children.some(s => {
                        if(s.kind === 4 && s.name === "Meta"){
                            return s.children.some(a => a.name === "abstract");
                        }
                        return false;
                    });

                    // Process all fields
                    let fields = c.children.filter(f => f.kind === 12) as FixedDocumentSymbol[];
                    let modelFields: ModelField[] = await Promise.all(fields.map(async (f: FixedDocumentSymbol) => {
                        let fType = await getFieldType(f.location, f.name);
                        return {
                            name: f.name,
                            type: fType,
                            symbol: f
                        };   
                    }));

                    // Pull it all together
                    let parsed: ModelClass = {
                        name: c.name,
                        parentFolderName: uri.path.split('/')[uri.path.split('/').length - 2],
                        parentClass: parentClass,
                        fileUri: uri.fsPath,
                        fields: modelFields,
                        properties: c.children.filter(f => f.kind === 5)
                    };
                    
                    if(abstract){
                        abstracts[c.name] = parsed;
                    }else{
                        results.push(parsed);
                    }
                }
            });

        }
    }
    
    // Filter out classes that aren't models
    results = results.filter(r => {
        if(r.parentClass === "models.Model"){
            return true;
        }else{
            return abstracts[r.parentClass] !== undefined;
        }
    });

    // Extend Models with abstract classes
    results.forEach(r => {
        let curParentClass = r.parentClass;
        while(curParentClass !== 'models.Model'){
            if(abstracts[curParentClass] === undefined){
                break; // Abort if the abstract class doesn't exist
            }
            r.fields.push(...abstracts[curParentClass].fields);
            r.properties.push(...abstracts[curParentClass].properties);
            curParentClass = abstracts[curParentClass].parentClass;
        }
    });

    return results;
}
