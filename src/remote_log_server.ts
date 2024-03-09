import * as net from 'net'
import * as vscode from 'vscode'

export class RemoteLogServer {
	enabled: boolean
	server: net.Server

	statusBarItem: vscode.StatusBarItem
	outputChannel: vscode.OutputChannel


	constructor() {
		this.enabled = true
		this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1)
		this.statusBarItem.text = "Remote Log Server: $(debug-start) "
		this.statusBarItem.tooltip = "Click the button to start monitoring the log."
		this.statusBarItem.command = "RemoteLogServerWithColorfulLog.start_rls"
		this.statusBarItem.show()

		this.outputChannel = vscode.window.createOutputChannel("TCP Log Server Output", "Colorful Log")
		this.outputChannel.show()

		this.server = net.createServer({ allowHalfOpen: true }, (socket: net.Socket) => {
			socket.setEncoding('utf8')
			socket.setKeepAlive(true)

			let remoteAddress = socket.remoteAddress + ':' + socket.remotePort?.toString()
			// vscode.window.setStatusBarMessage(`Logger connected: ${remoteAddress}`, 1000)

			socket.on('data', (data: Buffer) => {
				if (!this.enabled) return
				this.outputChannel.append(data.toString())
			})

			socket.on('end', () => {
				// vscode.window.setStatusBarMessage(`Logger done: ${remoteAddress}`, 1000)
				this.outputChannel.appendLine("---------------------- END ----------------------")
			})

			socket.on('close', (err) => {
				// vscode.window.setStatusBarMessage(`Logger disconnected: ${remoteAddress}${err ? `, error ${err}` : ''}`, 1000)
				this.outputChannel.appendLine("----------------------CLOSE----------------------")
			})
		})
	}

	public start() {
		this.enabled = true
		this.statusBarItem.command = "RemoteLogServerWithColorfulLog.stop_rls"
		this.statusBarItem.text = "Remote Log Server: $(debug-stop)"
		this.statusBarItem.tooltip = "Click the button to stop monitoring the log.\nPort:9020"
		let conf = vscode.workspace.getConfiguration('RemoteLogServerWithColorfulLog')
		this.server.listen(conf.get('port'), conf.get('host'), () => {
			// vscode.window.setStatusBarMessage(`Log server started: ${JSON.stringify(this.server.address())}`, 3000)
			vscode.window.showInformationMessage(`The Remote Log Server Started: ${JSON.stringify(this.server.address())}`)
			this.outputChannel.appendLine("----------------------START----------------------")
		}).on('error', (error: any) => {
			// Failed to monitor
			vscode.window.showErrorMessage(`Failed to start the Remote Log Server: ${error.message}`)
			this.outputChannel.appendLine(`Error starting the server: ${error.message}`)
		})
	}

	public stop() {
		this.enabled = false
		this.statusBarItem.text = "Remote Log Server: $(debug-start) "
		this.statusBarItem.tooltip = "Click the button to start monitoring the log."
		this.statusBarItem.command = "RemoteLogServerWithColorfulLog.start_rls"
		vscode.window.showInformationMessage("The Remote Log Server Has Stop")
		this.server.close()
		// vscode.window.setStatusBarMessage('Log server stopped', 1000)
	}

	public toggle() {
		this.enabled = !this.enabled
		vscode.window.setStatusBarMessage(this.enabled ? 'Log server resumes' : 'Log server is paused', 2000)
	}

	public clear() {
		if (this.enabled) {
			this.outputChannel.clear();
		}
	}
}