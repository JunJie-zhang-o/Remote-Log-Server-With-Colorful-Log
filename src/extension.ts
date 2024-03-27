import * as vscode from 'vscode'
import { RemoteLogServer } from './remote_log_server'



const rls:RemoteLogServer = new RemoteLogServer()

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand('RemoteLogServerWithColorfulLog.start_rls', () => { rls.start() }))
	context.subscriptions.push(vscode.commands.registerCommand('RemoteLogServerWithColorfulLog.stop_rls', () => { rls.stop() }))
	context.subscriptions.push(vscode.commands.registerCommand('RemoteLogServerWithColorfulLog.toggle_rls', () => { rls.toggle() }))
	context.subscriptions.push(vscode.commands.registerCommand('RemoteLogServerWithColorfulLog.clear_rls', () => { rls.clear() }))
	context.subscriptions.push(rls.statusBarItem)


	vscode.workspace.onDidChangeConfiguration((event) => {
		if (event.affectsConfiguration('RemoteLogServerWithColorfulLog')) { 

			if (!rls.enabled) {
				rls.updateStatusBarTooltip()
			}
		}
	});

}

export function deactivate() { }