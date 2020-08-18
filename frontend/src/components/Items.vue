<template>
  <div id="items-component">
    <v-expansion-panels dark>
      <template v-for="(item, index) in items">
        <v-expansion-panel v-if="isFiltered(item.fqid)" :key="index">
          <v-expansion-panel-header class="homepage pa-2">
            <a style="font-size:14px">{{item.title}}</a>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card-text class="pa-0 ma-0" style="font-size:12px">{{item.description}}</v-card-text>
            <v-card-text class="pa-0 ma-0" style="font-size:12px">Item ID: {{item.fqid}}</v-card-text>
            <v-card-text class="pa-0 ma-0" style="font-size:12px" v-if="item.labels">Labels:</v-card-text>
            <v-card-text
              class="pa-0 ma-0"
              style="font-size:12px"
              v-for="(label,index) in item.labels"
              :key="index"
            >
              <v-card-text
                class="pa-0 ma-0"
                style="font-size:12px;text-indent:40px"
                v-for="(value, key) in label"
                :key="key"
              >{{key}}: {{value}}</v-card-text>
            </v-card-text>
            <v-btn class="mt-6" @click="onAction(item)">{{item.actionName}}</v-btn>
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
      filteredItems: new Set()
    };
  },
  props: ["collection", "items", "filter"],
  methods: {
    onAction(item) {
      // fire 'action' event
      this.$emit("action", this.collection.id, item.fqid);
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
</style>
