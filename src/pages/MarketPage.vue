<template>
  <div class="fullViewPage">
    <MarketView id="MarketView"></MarketView>
    <Navigate id="Navigate"></Navigate>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import store from "../store";
import "../components/market/loading";
import MarketView from "../components/market/market.vue";
import Navigate from "../components/market/navigate.vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "MarketPage",
  components: {
    MarketView: MarketView,
    Navigate: Navigate,
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
#MarketView {
  z-index: 2;
  position: relative;
}
.fullViewPage {
  position: relative;
}
</style>
