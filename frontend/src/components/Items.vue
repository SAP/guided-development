<template>
  <div id="items-component">
    <v-expansion-panels dark>
      <v-expansion-panel v-for="(item, index) in items" :key="index">
        <v-expansion-panel-header class="homepage pa-2"><a style="font-size:14px">{{item.data.messages.title}}</a></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card-text class="pa-0 ma-0" style="font-size:12px">{{item.data.messages.description}}</v-card-text>
          <v-btn class="mt-6" @click="onAction(item.id)">{{item.data.action.buttonText}}</v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>

export default {
  name: "Items",
  props: ["items"],
  computed: {
  },
  methods: {
    async onAction(item) {
      // fire 'action' event
      this.$emit("action", item);
    }

  }
}
</script>

<style>
</style>
