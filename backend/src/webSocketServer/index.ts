import * as WebSocket from 'ws';
import { RpcExtensionWebSockets } from '@sap-devx/webview-rpc/out.ext/rpc-extension-ws';
import { GuidedDevelopment } from '../guided-development';
import { AppLog } from "../app-log";
import { ServerLog } from './server-log';
import backendMessages from "../messages";
import { IChildLogger } from "@vscode-logging/logger";
import { AppEvents } from '../app-events';
import { ICollection } from '../types/GuidedDev';
import { ServerEvents } from './server-events';
// import * as vscode from 'vscode';

class GuidedDevelopmentWebSocketServer {
  private rpc: RpcExtensionWebSockets | undefined;
  private guidedDevelopment: GuidedDevelopment | undefined;
  private appEvents: AppEvents;

  constructor() {
    this.appEvents = new ServerEvents();
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
      const collections = createCollections();
      this.guidedDevelopment = new GuidedDevelopment(this.rpc, this.appEvents, logger, childLogger as IChildLogger, backendMessages, collections);
    });
  }
}

function createCollections(): ICollection[] {
	const collections: ICollection[] = [];
  let collection: ICollection = {
    id: "collection1",
    title: "Demo collection",
    description: "This is a demo collection. It contains a self-contributed item and and items contributed by a different contributor.",
    itemIds: [
        "SAPOSS.contrib1.open",
        "SAPOSS.contrib2.clone"
    ],
    items: [
      {
        id: "open",
        fqid: "SAPOSS.contrib1.open",
        title: "Open Global Settings (via execute)",
        description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
        actionName: "Open",
        actionType: "execute",
        performAction: () => {
            console.log("workbench.action.openGlobalSettings");
            return Promise.resolve();
        },
        labels: [
            {"Project Name": "cap1"},
            {"Path": "/home/user/projects/cap1"},
            {"Project Type": "CAP"},
        ]
      },
      {
        id: "open-command",
        fqid: "SAPOSS.contrib2.open-command",
        title: "Open Global Settings (via command)",
        description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
        actionName: "Open",
        actionType: "command",
        command: {
            name: "workbench.action.openGlobalSettings"
        },
        labels: [
          {"Project Name": "cap2"},
          {"Path": "/home/user/projects/cap2"},
          {"Project Type": "CAP"},
      ]
    }
    ]
  };
  collections.push(collection);

  collection = {
    id: "collection2",
    title: "Another demo collection",
    description: "This is another demo collection.",
    itemIds: [
        "SAPOSS.contrib2.open"
    ],
    items: [
      {
        id: "open",
        fqid: "SAPOSS.contrib2.open",
        title: "Open Global Settings (via execute)",
        description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
        actionName: "Open",
        actionType: "execute",
        performAction: () => {
            console.log("workbench.action.openGlobalSettings");
            return Promise.resolve();
        },
        labels: [
            {"Project Name": "cap1"},
            {"Path": "/home/user/projects/cap1"},
            {"Project Type": "CAP"},
        ]
      }
    ]
  };
  collections.push(collection);

  return collections;
}

const wsServer = new GuidedDevelopmentWebSocketServer();
wsServer.init();
