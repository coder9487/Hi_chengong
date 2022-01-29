<template id="body">
  <div id="loadingGroup">
    <img src="../../public/loading/loadingPhoto_test.png" alt="" />
    <video autoplay loop id="waveVideo">
      <source src="../../public/loading/wave.mp4" type="video/mp4" />
    </video>
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
      DEBUG: 2,
    };
  },
  computed: {},
  methods: {
    getLoadingProgress(val) {
      
      let loadedProgress = (val/131005377).toFixed(2)*100
      let loadingWave = document.getElementById("waveVideo");
      loadingWave.style.top = `${-620 - loadedProgress*1.8}`
      //console.log("Loading progress ", loadingWave.style.top);

      if (val == 131005377 * this.DEBUG) {
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
#loadingGroup {
  position: flex;
  display: blocks;

}
#loadingGroup video {
  position: relative;
  margin-left: 30%;
  top: -600px;
  width: 40vw;
  z-index: 9;
}
#loadingGroup img {
  position: relative;
  width: 100vw;
  z-index: 10;
  opacity: 0.95;
}
#body {
  overflow-y: hidden;
  overflow-x: hidden;
}
</style>
