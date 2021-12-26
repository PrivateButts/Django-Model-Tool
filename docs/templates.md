# How to Customize Generator Templates

If the default templates don't work for you, you can alter them in VS Code's settings. Templates are processed using [Handlebars](handlebarsjs.com). Refer to the section for each template to see what context the templates are rendered with.

## Model Admin

This template with have a ModelClass object passed into it. This will expose the following variables for you to play with

Variable   | Type   | Description
-----------|--------|------------
name       | string | The name of the model class
parentName | string | The folder name the model.py file resides inside of
fileUri    | string | The full path to the model.py file
fields     | array  | Array of vscode.DocumentSymbol objects representing class fields
fields.name | String