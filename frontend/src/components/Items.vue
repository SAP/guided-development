<template>
  <div id="items-component">
    <v-expansion-panels dark focusable :multiple="mode !== 'single' ? true : false" v-model="expandedPanels">
      <template v-for="(contextualItem, index) in contextualItems">
        <v-expansion-panel v-if="isFiltered(contextualItem.item.fqid)" :key="index" v-bind:class="getClass(contextualItem.item)">
          <v-expansion-panel-header v-bind:class="{ 'pa-5':true, 'itemColor':bColorFlag, 'subItemColor':!bColorFlag}"  @click.stop="onClickPanel(contextualItem, index)">
              <a class="expansion-panel-title">{{contextualItem.item.title}}</a>
              <div hidden>Item ID: {{contextualItem.item.fqid}}</div>
              <div hidden v-if="contextualItem.context">Project: {{contextualItem.context.project}}</div>
          </v-expansion-panel-header>
          <v-expansion-panel-content v-bind:class="{'headline':true, 'itemColor':bColorFlag, 'subItemColor':!bColorFlag}">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="8" style="margin-left:20px">
                  <v-card-text class="pa-0 ma-0" style="font-size:12px">
                    <span v-html="contextualItem.item.description"></span>
                  </v-card-text>
                  <div v-if="false">
                    <v-card-text class="pa-0 ma-0" style="font-size:12px" v-if="contextualItem.item.labels">Labels:</v-card-text>
                    <v-card-text class="pa-0 ma-0" style="font-size:12px" v-for="(label,index) in contextualItem.item.labels" :key="index">
                      <v-card-text class="pa-0 ma-0" style="font-size:12px;text-indent:40px" v-for="(value, key) in label" :key="key">{{key}}: {{value}}</v-card-text>
                    </v-card-text>
                  </div>
                </v-col>
                <v-col cols="6" md="3">
                  <ImageDlg
                      v-if="contextualItem.item.image"
                      :image="contextualItem.item.image"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col style="margin-left: 20px">
                  <Items
                    v-if="contextualItem.item.items"
                    :items="contextualItem.item.items"
                    :filter="filter"
                    :bColorFlag="!bColorFlag"
                    :mode="mode"
                    @action="onAction"
                    @clickPanel="onClickPanel"
                  />
                  <v-list-item-subtitle class="py-1" v-if="contextualItem.item.action1 && contextualItem.item.action1.title && !contextualItem.item.items">{{contextualItem.item.action1.title}}</v-list-item-subtitle>
                  <v-btn small v-if="contextualItem.item.action1 && !contextualItem.item.items" @click="onAction(contextualItem, 1)">{{contextualItem.item.action1.name}}</v-btn>
                  <v-list-item-subtitle class="py-1 mt-4" v-if="contextualItem.item.action2 && contextualItem.item.action2.title && !contextualItem.item.items">{{contextualItem.item.action2.title}}</v-list-item-subtitle>
                  <v-btn small v-if="contextualItem.item.action2 && !contextualItem.item.items" @click="onAction(contextualItem, 2)">{{contextualItem.item.action2.name}}</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </template>
    </v-expansion-panels>
  </div>
</template>

<script>
import ImageDlg from "./ImageDlg.vue";

export default {
  components: {
    ImageDlg,
  },
  name: "Items",
  data() {
    return {
      imageDialog: false,
      filteredItems: new Set(),
      expandedPanels: null,
    };
  },
  props: ["items", "filter", "bColorFlag", "mode"],
  methods: {
    onAction(contextualItem, index) {
      // fire 'action' event
      this.$emit("action", contextualItem, index);
    },
    isFiltered(itemFqid) {
      return this.filteredItems.has(itemFqid);
    },
   onClickPanel(contextualItem, index) {
      this.$emit("clickPanel", contextualItem, index);
    },
    getClass(item) {
      return {
        readItemStyle: item.readState === "READ",
        unreadItemStyle: item.readState === "UNREAD" || item.readState === "WAIT"
      };
    },
  },
  computed: {
    contextualItems: function () {
      const result = [];
      for (const item of this.items) {
        if (item.action1) {
          if (item.action1.contexts) {
            // multiple contexts -- duplicate item
            for (const context of item.action1.contexts) {
              result.push({ item, context });
            }
          } else {
            // no contexts -- show item only once
            result.push({ item, context: undefined });
          }
        } else {
          // no actions -- probably has subitems
          result.push({ item, context: undefined });
        }
      }
      return result;
    },
  },
  watch: {
    filter: {
      handler: function () {
        this.filteredItems = new Set();
        if (this.items) {
          for (const item of this.items) {
            let foundLabelMismatch = false;
            for (const label of item.labels) {
              const labelKey = Object.keys(label)[0];
              const labelValue = Object.values(label)[0];
              for (const [filterKey, filterValue] of this.filter) {
                if (
                  filterKey === labelKey &&
                  filterValue !== labelValue &&
                  filterValue !== "__all"
                ) {
                  foundLabelMismatch = true;
                  break;
                }
              }
              if (foundLabelMismatch) {
                break;
              }
            }
            if (!foundLabelMismatch) {
              this.filteredItems.add(item.fqid);
            }
          }
        }
      },
      immediate: true,
    },
    items: {
      handler: function () {
        if (
          this.items.some((item) => item.hasOwnProperty("activeState")) &&
          this.mode === 'single'
        ) {
          let activeItem = null;
          for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.activeState) {
              activeItem = i;
              break;
            }
          }
          this.expandedPanels = activeItem;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  updated() {
    if (
      this.items.some((item) => item.hasOwnProperty("activeState")) &&
      this.mode === 'single'
    ) {
      this.items.forEach((i) => (i.activeState = false));
      if (typeof this.expandedPanels === "number") {
        this.items[this.expandedPanels].activeState = true;
      }
    }
  },
};
</script>
<style>
.v-expansion-panel::before {
  box-shadow: none !important;
}
.v-expansion-panel {
  box-shadow: none;
}
.v-expansion-panel-header {
  text-transform: none;
}

.v-expansion-panel-header--active:before {
  opacity: 0 !important;
}
.v-application .expansion-panel-title {
  font-size: 14px;
  color: var(--vscode-foreground, #cccccc);
  padding-left: 28px;
  padding-bottom: 8px;
}

#items-component .v-expansion-panel {
  margin-top: 3px;
}

.itemColor {
  background-color: var(--vscode-sideBar-background, #1e1e1e);
}

.itemColor .subItemColor {
  background-color: var(--vscode-activityBar-background, #1e1e1e);
}

.itemColor .v-btn {
  margin-right: 0.5rem;
}

.v-expansion-panel-content__wrap {
  color: var(--vscode-foreground, #cccccc);
  text-transform: none;
}
.v-expansion-panel-header__icon {
  position: absolute;
}
.v-expansion-panel-header__icon .v-icon {
  color: var(--vscode-foreground, #cccccc) !important;
}
.v-card.v-sheet {
  background-color: var(--vscode-editor-background, #1e1e1e);
}

.v-expansion-panel.readItemStyle {
  border-left: 4px solid var(--vscode-charts-purple, #925ace) !important;
}
.v-expansion-panel.unreadItemStyle {
  border-left: 4px solid var(--vscode-charts-blue, #0a6ed1) !important;
}


.v-application .v-expansion-panel-header .expansion-panel-title {
  padding-bottom: 0;
}
</style>
