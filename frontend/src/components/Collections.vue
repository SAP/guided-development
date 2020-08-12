<template>
  <div id="collections-component">
    <div v-for="(collection, index) in collections" :key="index"><br>
      <v-card-title class="prompt-title" style="font-size:16px">{{collection.messages.title}}</v-card-title>
      <v-card-subtitle class="prompt-title" style="font-size:14px">{{collection.messages.description}}</v-card-subtitle>
      <Items
        v-if="collection.items"
        :items="collection.items"
        @action="onAction"
      />
    </div>
  </div>
</template>

<script>
import Items from "./Items.vue";

export default {
  components: {
    Items
  },
  name: "Collections",
  props: ["collections"],
  computed: {
  },
  methods: {
    async onAction(collection) {
      // fire 'action' event
      this.$emit("action", collection);
    }
  }
}
</script>

<style>
</style>
