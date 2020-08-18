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
    <Collections
      v-if="collections"
      :collections="collections"
      @action="onAction"
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
    showBusyIndicator: false,
  };
}

export default {
  name: "app",
  components: {
    Collections,
    Loading
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
  watch: {
  },
  methods: {
    async onAction(collectionId, itemFqid) {
      await this.rpc.invoke("performAction", [collectionId, itemFqid]);
    },
    async showCollections(collections) {
      this.collections = collections;
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
      const functions = [
        "showCollections",
      ];
      for (const funcName of functions) {
        this.rpc.registerMethod({
          func: this[funcName],
          thisArg: this,
          name: funcName
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
      // const uiOptions = await this.rpc.invoke("getState");
      // this.messages = uiOptions.messages;
      // if (this.isInVsCode()) {
      //   window.vscode.setState(uiOptions);
      // }
    }
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
  border-top: 2px solid  var(--vscode-editorWidget-background, #252526);
  padding-right: 25px;
}
.bottom-buttons-col > .v-btn:not(:last-child) {
    margin-right: 10px !important;
}
</style>
