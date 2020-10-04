<template>
  <div id="items-component">
    <v-expansion-panels dark focusable multiple>
      <template :v-if="contextualItems" v-for="(contextualItem, index) in contextualItems">
        <v-expansion-panel v-if="isFiltered(contextualItem.item.fqid)" :key="index">
          <v-expansion-panel-header class="pa-5"><a style="font-size:14px">{{contextualItem.item.title}}</a></v-expansion-panel-header>
          <v-expansion-panel-content class="headline">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="8" style="margin-left:20px">
                  <v-card-text class="pa-0 ma-0" style="font-size:12px">{{contextualItem.item.description}}</v-card-text>
                  <v-card-text class="pa-0 ma-0" style="font-size:12px">Item ID: {{contextualItem.item.fqid}}</v-card-text>
                  <v-card-text class="pa-0 ma-0" style="font-size:12px" v-if="contextualItem.context">Context ID: {{ contextualItem.context.id }}</v-card-text>
                  <v-card-text class="pa-0 ma-0" style="font-size:12px" v-if="contextualItem.item.labels">Labels:</v-card-text>
                  <v-card-text class="pa-0 ma-0" style="font-size:12px" v-for="(label,index) in contextualItem.item.labels" :key="index">
                    <v-card-text class="pa-0 ma-0" style="font-size:12px;text-indent:40px" v-for="(value, key) in label" :key="key">{{key}}: {{value}}</v-card-text>
                  </v-card-text>
                </v-col>
                <v-col cols="6" md="3">
                  <v-img v-if="contextualItem.item.image" style="cursor:pointer" :src="contextualItem.item.image.image" max-width="80%" @click="imageDialog = true">
                    <v-icon v-if="contextualItem.item.image" style="position:absolute;bottom:0px;right:0px" @click="imageDialog = true">search</v-icon>
                  </v-img>
                  <v-card-text v-if="contextualItem.item.image" align="left" class="mt-4 pb-0" style="font-size:14px;padding-left:0px"><b>Note</b></v-card-text>
                  <v-card-text v-if="contextualItem.item.image" align="left" class="pa-0 ma-0" style="font-size:12px;padding-left:0px">{{contextualItem.item.image.note}}</v-card-text>
                  <v-dialog v-model="contextualItem.item.imageDialog" max-width="40%">
                    <v-card align="center" height="100%">
                      <v-img v-if="contextualItem.item.image" :src="contextualItem.item.image.image" alt="" width="100%" height="100%" @click.stop="imageDialog = false">
                        <v-icon style="position:absolute;top:0px;right:0px" @click.stop="imageDialog = false">clear</v-icon>
                      </v-img>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
              <v-row>
                <v-col style="margin-left:20px">
                  <Items
                      v-if="contextualItem.item.items"
                      :items="contextualItem.item.items"
                      :filter="filter"
                      @action="onAction"
                  />
                  <v-list-item-subtitle class="py-4" v-if="contextualItem.item.action1 && contextualItem.item.action1.title && !contextualItem.item.items">{{contextualItem.item.action1.title}}</v-list-item-subtitle>
                  <v-btn small v-if="contextualItem.item.action1 && !contextualItem.item.items" @click="onAction(contextualItem, 1)">{{contextualItem.item.action1.name}}</v-btn>
                  <v-list-item-subtitle class="py-4" v-if="contextualItem.item.action2 && contextualItem.item.action2.title && !contextualItem.item.items">{{contextualItem.item.action2.title}}</v-list-item-subtitle>
                  <v-btn small v-if="contextualItem.item.action2 && !contextualItem.item.items" @click="onAction(contextualItem, 2)">{{item.action2.name}}</v-btn>
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
export default {
  name: "Items",
  data() {
    return {
      imageDialog: false,
      filteredItems: new Set()
    };
  },
  props: ["contextualItems", "filter"],
  methods: {
    onAction(contextualItem, index) {
      // fire 'action' event
      this.$emit("action", contextualItem, index);
    },
    isFiltered(itemFqid) {
      return this.filteredItems.has(itemFqid);
    },
  },
  watch: {
    filter: {
      handler: function () {
        this.filteredItems = new Set();
        for (const contextualItem of this.contextualItems) {
          const item = contextualItem.item;
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
      },
      immediate: true
    },
  },
};
</script>

<style>
.v-expansion-panel-header {
  background-color: var(--vscode-editor-background, #1e1e1e);
  text-transform: none;
}
button.v-expansion-panel-header--active {
  background-color: var(--vscode-list-hoverBackground,#2a2d2e) !important;
}
.v-expansion-panel-header--active:before {
  opacity: 0 !important;
}
.v-application a {
  color:var(--vscode-foreground, #cccccc) !important;
  padding-left: 28px ;
  padding-bottom: 8px ;
}
.v-expansion-panel-content__wrap {
  background-color: var(--vscode-list-hoverBackground,#2a2d2e);
  color: var(--vscode-foreground, #cccccc);
  text-transform: none;
}
.v-expansion-panel-header__icon {
  position:absolute;
}
.v-expansion-panel .v-icon,
.v-expansion-panel-header__icon .v-icon {
  color: var(--vscode-foreground, #cccccc) !important;
}
.v-card.v-sheet {
  background-color: var(--vscode-editor-background, #1e1e1e);
}
</style>
