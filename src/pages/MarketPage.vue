<template>
  <div id="loadingGroup">
    <img src="../../public/loading/loading.png" alt="" />
  </div>

  <div class="fullViewPage">
    <MarketView
      id="MarketView"
      @loadingProgress="getLoadingProgress"
      v-if="showEnable"
    ></MarketView>
    <Navigate id="Navigate" v-if="showEnable"></Navigate>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
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
  setup() {},
  watch: {},
  data() {
    return {
      progressPercent: ref(0),
      showEnable: ref(true),
    };
  },
  computed: {},
  methods: {
    getLoadingProgress(val) {
      console.log("Loading ", val);
      if (val == 131005377) {
        this.showEnable = true;
        let element = document.getElementsByClassName("fullViewPage");
        element[0].style.opacity = 1;
        let MarketView_element = document.getElementById("MarketView");
        MarketView_element.style.opacity = 1;
        let loading = document.getElementById("loadingGroup");
        loading.style.opacity = 0;
        
      }
    },
  },
});
</script>
<style lang="scss">
#MarketView {
  z-index: 2;
  position: relative;
  opacity: 0.1;
}
#Navigate {
}
.fullViewPage {
  position: relative;
  opacity: 0;
}
#loadingGroup * {
  position: relative;
  z-index: 100;
}
</style>
