import * as WebSocket from 'ws';
import { RpcExtensionWebSockets } from '@sap-devx/webview-rpc/out.ext/rpc-extension-ws';
import { GuidedDevelopment } from '../guided-development';
import { AppLog } from "../app-log";
import { ServerLog } from './server-log';
import backendMessages from "../messages";
import { IChildLogger } from "@vscode-logging/logger";
import { AppEvents } from '../app-events';
import { IInternalItem, IInternalCollection } from "../Collection";
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
      const items = createItems(collections);
      this.guidedDevelopment = new GuidedDevelopment(this.rpc, this.appEvents, logger, childLogger as IChildLogger, backendMessages, collections, items);
    });
  }
}

function createItems(collections: IInternalCollection[]): Map<string, IInternalItem> {
  const items = new Map();
  return items;
}

function createCollections(): IInternalCollection[] {
	const collections: IInternalCollection[] = [];
  let collection: IInternalCollection = {
    id: "collection1",
    title: "Demo collection",
    description: "This is a demo collection. It contains a self-contributed item and and items contributed by a different contributor.",
    itemIds: [
        "SAPOSS.vscode-contrib1.open",
        "SAPOSS.vscode-contrib2.clone"
    ],
    items: [
      {
        id: "open",
        fqid: "SAPOSS.vscode-contrib1.open",
        title: "Open Global Settings (via execute)",
        description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
        action: {
          name: "Open",
          type: "execute",
          performAction: () => {
              console.log("workbench.action.openGlobalSettings");
              return Promise.resolve();
          },
        },
        labels: [
            {"Project Name": "cap1"},
            {"Path": "/home/user/projects/cap1"},
            {"Project Type": "CAP"},
        ]
      },
      {
        id: "open-command",
        fqid: "SAPOSS.vscode-contrib2.open-command",
        title: "Open Global Settings (via command)",
        description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
        action: {
          name: "Open",
          type: "command",
          command: {
              name: "workbench.action.openGlobalSettings"
          },
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
        "SAPOSS.vscode-contrib2.show-items"
    ],
    items: [
      {
        id: "show-items",
        title: "Show items",
        description: "Shows list of items",
        fqid: "SAPOSS.vscode-contrib2.show-items",
        itemIds: [
          "SAPOSS.vscode-contrib2.open-command"
        ],
        items: [
          {
            id: "open-command",
            fqid: "SAPOSS.vscode-contrib2.open-command",
            title: "Open Global Settings (via command)",
            description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
            action: {
              name: "Open",
              type: "command",
              command: {
                  name: "workbench.action.openGlobalSettings"
              },
            },
            labels: [
              {"Project Name": "cap2"},
              {"Path": "/home/user/projects/cap2"},
              {"Project Type": "CAP"},
            ]
          }
        ],
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
