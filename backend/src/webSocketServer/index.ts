import * as WebSocket from 'ws';
import { RpcExtensionWebSockets } from '@sap-devx/webview-rpc/out.ext/rpc-extension-ws';
import { GuidedDevelopment } from '../guided-development';
import { AppLog } from "../app-log";
import { ServerLog } from './server-log';
import { ServerEvents } from './server-events';
import backendMessages from "../messages";
import { IChildLogger } from "@vscode-logging/logger";
import { AppEvents } from '../app-events';

class GuidedDevelopmentWebSocketServer {
  private rpc: RpcExtensionWebSockets | undefined;
  private guidedDevelopment: GuidedDevelopment | undefined;
  private async mockFolderDialog() {
    return "mock path";
  }

  init() {
    // web socket server
    const port = (process.env.PORT ? Number.parseInt(process.env.PORT) : 8081);
    const wss = new WebSocket.Server({ port: port }, () => {
      console.log('started websocket server');
    });
    wss.on('listening', () => {
      console.log(`listening to websocket on port ${port}`);
    });

    wss.on('error', (error) => {
      console.error(error);
    });

    wss.on('connection', (ws) => {
      console.log('new ws connection');

      this.rpc = new RpcExtensionWebSockets(ws);
      //TODO: Use RPC to send it to the browser log (as a collapsed pannel in Vue)
      const logger: AppLog = new ServerLog(this.rpc);
      const childLogger = {debug: () => {}, error: () => {}, fatal: () => {}, warn: () => {}, info: () => {}, trace: () => {}, getChildLogger: () => {return {} as IChildLogger;}};
      const appEvents: AppEvents = new ServerEvents(this.rpc);
      const guidedDev = createGuidedDev();
      this.guidedDevelopment = new GuidedDevelopment(this.rpc, appEvents, logger, childLogger as IChildLogger, {messages: backendMessages, guidedDevs: guidedDev});
    });
  }
}

function createGuidedDev(): any[] {
	const guidedDev: any[] = [];

    guidedDev.push(
		{
			messages: {
				title: "Create Launch Configuration",
				description: "Provide details for the launch configuration you want to create."
			},
			action: {
				buttonText: "Create"
			}
		},
		{
			messages: {
				title: "Data Monitoring",
				description: "Add data from a source."
			},
			action: {
				buttonText: "Add"
			}
		}
	  );
  
    return guidedDev;
}

const wsServer = new GuidedDevelopmentWebSocketServer();
wsServer.init();
