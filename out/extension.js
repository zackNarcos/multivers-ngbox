"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const componentUtils_1 = require("./utils/component/componentUtils");
function activate(context) {
    const disposable = vscode.commands.registerCommand('mutlivers-ngbox.scan', () => {
        const currentWorkspace = vscode.workspace.workspaceFolders?.[0];
        const projectPath = currentWorkspace?.uri.fsPath;
        if (projectPath) {
            const unusedComponents = scanForUnusedComponents(projectPath);
            const panel = vscode.window.createWebviewPanel('unusedComponents', 'Unused Components', vscode.ViewColumn.Two, {});
            panel.webview.html = getWebviewContent(unusedComponents);
        }
        else {
            vscode.window.showErrorMessage('No Angular project found in workspace!');
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function scanForUnusedComponents(projectPath) {
    return (0, componentUtils_1.getUnUsedProjectComponents)(projectPath, "not-used");
}
function getWebviewContent(_unusedComponents) {
    return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Unused Components</title>
	</head>
	<body>
		<h1>Unused Components</h1>
		<table>
			<thead>
				<tr>
					<th>Component</th>
				</tr>
			</thead>
			<tbody>
				${_unusedComponents.map(component => `
						<tr><td>${component.className}</td></tr>
`).join('')}
			</tbody>		
        </table>
	</body>
	</html>`;
}
//# sourceMappingURL=extension.js.map