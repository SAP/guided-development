<template>
  <v-app id="app" class="vld-parent">
    <loading
      :active.sync="showBusyIndicator"
      :is-full-page="true"
      :height="64"
      :width="64"
      :color="isLoadingColor"
      background-color="transparent"
      loader="spinner"
    ></loading>
    <div>
      <v-card-title>{{ messages.title }}</v-card-title>
      <v-card-subtitle>{{ messages.description }}</v-card-subtitle>
    </div>
    <Collections
      v-if="collections"
      :collections="collections"
      @action="onAction"
      @clickPanel="onClickPanel"
    />
  </v-app>
</template>

<script>
import Loading from "vue-loading-overlay";
import Collections from "./components/Collections.vue";
import { RpcBrowser } from "@sap-devx/webview-rpc/out.browser/rpc-browser";
import { RpcBrowserWebSockets } from "@sap-devx/webview-rpc/out.browser/rpc-browser-ws";
function initialState() {
  return {
    collections: [],
    rpc: Object,
    messages: {},
    showBusyIndicator: false
  };
}
export default {
  name: "App",
  components: {
    Collections,
    Loading,
  },
  data() {
    return initialState();
  },
  computed: {
    isLoadingColor() {
      return (
        getComputedStyle(document.documentElement).getPropertyValue(
          "--vscode-progressBar-background"
        ) || "#0e70c0"
      );
    },
  },
  watch: {},
  methods: {
    async onAction(contextualItem, index) {
      const itemFqid = contextualItem?.item?.fqid;
      await this.rpc.invoke("performAction", [
        itemFqid,
        index,
        contextualItem.context,
      ]);
    },
  getItem(itemFqid) {
    for (const collection of this.collections) {
      for (const item of collection.items) {
        if (item.fqid === itemFqid) {
          return item;
        }
        if (item.items) {
          for (const subItem of item.items) {
            if (subItem.fqid === itemFqid) {
              return subItem;
            }  
            else if( subItem.items ){
              const deepSubitem =  this.getDeepSubitem(itemFqid, subItem);
              if(deepSubitem){
                return deepSubitem;
              }
            }
          }
        }
      }
    }
    // TODO - console log: item does not exist
  },
 getDeepSubitem( itemFqId, item ){
    if( item.items ){
      for (const subItem of item.items) {
        if (subItem.fqid === itemFqId) {
          return subItem;
        } else if(subItem.items){
            return this.getDeepSubitem(itemFqId, subItem);
        } 
      }
    }
  },
  onClickPanel() {
    //to do: change state
 },
    async showCollections(collections) {
      this.collections = collections;
    },
    changeItemsState(changedItems) {
      for(let i=0; i < changedItems.length; i++){
        const tarItem = this.getItem(changedItems[i].fqid);
        const itement = changedItems[i];
        const changedItemC = { ...itement};
        delete changedItemC.fqid;
        Object.keys(changedItemC).forEach((key) => {
          tarItem[key] = changedItemC[key];
        });
      }
    },
    isInVsCode() {
      return typeof acquireVsCodeApi !== "undefined";
    },
    setupRpc() {
      /* istanbul ignore if */
      if (this.isInVsCode()) {
        // eslint-disable-next-line
        window.vscode = acquireVsCodeApi();
        this.rpc = new RpcBrowser(window, window.vscode);
        this.initRpc();
      } else {
        const ws = new WebSocket("ws://127.0.0.1:8081");
        /* istanbul ignore next */
        ws.onopen = () => {
          this.rpc = new RpcBrowserWebSockets(ws);
          this.initRpc();
        };
      }
    },
    initRpc() {
      const functions = ["showCollections", "changeItemsState"];
      for (const funcName of functions) {
        this.rpc.registerMethod({
          func: this[funcName],
          thisArg: this,
          name: funcName,
        });
      }
      this.rpcIsReady();
    },
    async rpcIsReady() {
      await this.setState();
      await this.rpc.invoke("onFrontendReady", []);
    },
    reload() {
      const dataObj = initialState();
      dataObj.rpc = this.rpc;
      Object.assign(this.$data, dataObj);
      this.rpcIsReady();
    },
    async setState() {
      this.messages = await this.rpc.invoke("getState");
    },
  },
  created() {
    this.setupRpc();
  },
};
</script>
<style scoped>
@import "./../node_modules/vue-loading-overlay/dist/vue-loading.css";
.left-col {
  background-color: var(--vscode-editorWidget-background, #252526);
}
.main-row {
  height: calc(100% - 4rem);
}
.left-col,
.right-col,
.right-row,
#step-component-div,
.right-col {
  padding: 0 !important;
}
.bottom-buttons-col {
  border-top: 2px solid var(--vscode-editorWidget-background, #252526);
  padding-right: 25px;
}
.bottom-buttons-col > .v-btn:not(:last-child) {
  margin-right: 10px !important;
}
.v-card__title {
  color: var(--vscode-foreground, #cccccc);
  margin-bottom: 16px;
  font-size: 32px;
}
.v-card__subtitle {
  margin-left: 4px;
}
.vld-parent {
  overflow-y: auto;
  margin: 0px;
  height: calc(100% - 4rem);
}
</style>
