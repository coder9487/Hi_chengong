<template>
  <div class="fullViewPage_table">
    <MarketTable id="MarketTable"></MarketTable>
    <NavigateMarketTable id="Navigate_MarketTable"></NavigateMarketTable>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

import MarketTable from "../components/DiningTable/DiningTable3D.vue";
import NavigateMarketTable from "../components/DiningTable/DiningTable2D.vue";


export default defineComponent({
  name: "DiningTable",
  components: {
    MarketTable: MarketTable,
    NavigateMarketTable: NavigateMarketTable,
  },
  setup() {


  },
  watch: {},
  data() {
    return {
      progressPercent: ref(0),
    };
  },
  computed: {},
  methods: {},
});
</script>
<style lang="scss">
#MarketTable {
  z-index: 2;
  position: relative;
}
.fullViewPage_table {
  position: relative;
}
</style>
