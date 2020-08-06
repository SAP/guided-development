<template>
  <div id="items-component">
    <table align="left">
      <tbody v-for="(item, index) in items" :key="index">
        <tr>
          <v-expansion-panels flat class="explore-generators">
            <v-expansion-panel>
              <v-expansion-panel-header class="homepage pa-2"><a style="text-decoration:underline">{{item.messages.title}}</a></v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col>
                    <v-card-text class="pa-0 ma-0" style="font-size:14px">{{item.messages.description}}</v-card-text>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn class="mt-6" @click="onAction">{{item.action.buttonText}}</v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>

export default {
  name: "Items",
  props: ["items"],
  computed: {
  }
}
</script>

<style>
</style>
