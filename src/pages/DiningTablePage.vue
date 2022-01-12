<template>
  <div class="fullViewPage_table">
    <MarketTable id="MarketTable"></MarketTable>
    <NavigateMarketTable id="Navigate_MarketTable"></NavigateMarketTable>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import store from "../store";
import "../components/market/loading";
import MarketTable from "../components/diningTable/marketTable.vue";
import NavigateMarketTable from "../components/diningTable/navigate.vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "DiningTable",
  components: {
    MarketTable: MarketTable,
    NavigateMarketTable: NavigateMarketTable,
  },
  setup() {

    //store.state.markedtOnProgress

    //   let interval = null;
    //   console.log('timer working')
    //   setTimeout(function () {
    //     interval = setInterval(function () {
    //       // Your code here

    //       if (store.state.markedtOnProgress == true)
    //       {
    //         clearInterval(interval);
    //         useQuasar().loading.hide()
    //       }
    //     }, 500);

    //   }, 50);
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
