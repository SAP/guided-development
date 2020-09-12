<template>
  <div id="items-component">
    <v-expansion-panels dark>
      <template v-for="(item, index) in items">
        <v-expansion-panel v-if="isFiltered(item.fqid)" :key="index">
          <v-expansion-panel-header class="pa-2"><a style="font-size:14px">{{item.title}}</a></v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container>
              <v-row>
                <v-col>
                  <v-card-text class="pa-0 ma-0" style="font-size:12px">{{item.description}}</v-card-text>
                  <v-card-text class="pa-0 ma-0" style="font-size:12px">Item ID: {{item.fqid}}</v-card-text>
                  <v-card-text class="pa-0 ma-0" style="font-size:12px" v-if="item.labels">Labels:</v-card-text>
                  <v-card-text class="pa-0 ma-0" style="font-size:12px" v-for="(label,index) in item.labels" :key="index">
                    <v-card-text class="pa-0 ma-0" style="font-size:12px;text-indent:40px" v-for="(value, key) in label" :key="key">{{key}}: {{value}}</v-card-text>
                  </v-card-text>
                </v-col>
                <v-col align="right" style="padding:0"> 
                  <v-img v-if="item.image" style="cursor:pointer" :src="item.image" width="100px" @click="imageDialog = true">
                    <v-icon v-if="item.image" style="position:absolute;bottom:0px;right:0px" @click="imageDialog = true">search</v-icon>
                  </v-img>
                  <v-dialog v-model="imageDialog" max-width="40%">
                    <v-card align="center" height="100%">
                      <v-img v-if="item.image" :src="item.image" alt="" width="100%" height="100%" @click.stop="imageDialog = false">
                        <v-icon style="position:absolute;top:0px;right:0px" @click.stop="imageDialog = false">clear</v-icon>
                      </v-img>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <Items
                      v-if="item.items"
                      :items="item.items"
                      :filter="filter"
                      @action="onAction"
                  />
                  <v-list-item-subtitle class="pt-2" v-if="item.action1 && item.action1.title && !item.items">{{item.action1.title}}</v-list-item-subtitle>
                  <v-btn small v-if="item.action1 && !item.items" @click="onAction(item.fqid, 1)">{{item.action1.name}}</v-btn>
                  <v-list-item-subtitle class="pt-4" v-if="item.action2 && item.action2.title && !item.items">{{item.action2.title}}</v-list-item-subtitle>
                  <v-btn small v-if="item.action2 && !item.items" @click="onAction(item.fqid, 2)">{{item.action2.name}}</v-btn>
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
  props: ["items", "filter"],
  methods: {
    onAction(itemFqid, index) {
      // fire 'action' event
      this.$emit("action", itemFqid, index);
    },
    isFiltered(itemFqid) {
      return this.filteredItems.has(itemFqid);
    },
  },
  watch: {
    filter: {
      handler: function () {
        this.filteredItems = new Set();
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
.v-application a {
  color:var(--vscode-foreground, #cccccc) !important;
  padding-left: 28px ;
}
.v-expansion-panel-content__wrap {
  background-color: var(--vscode-editor-background, #1e1e1e);
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
