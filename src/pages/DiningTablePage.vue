<template>
  <div>
    <loading
      id="loading"
      :LoadingProgress="returnloadingProgress"
      v-if="!showAvailable"
    ></loading>

    <DiningTable3D
      id="DiningTable3D"
      @loadingProgress="getLoadingProgress"
    ></DiningTable3D>
    <DiningTable2D id="DiningTable2D" v-if="1"></DiningTable2D>
  </div>
</template>

<script>
import DiningTable3D from "../components/diningTable/DiningTable3D.vue";
import DiningTable2D from "../components/diningTable/DiningTable2D.vue";
import loading from "../components/loadingView.vue";
import { ref } from "vue";
import gsap from "gsap";
export default {
  name: "three",
  components: { DiningTable3D, DiningTable2D, loading },
  setup() {
    let windowsObject;
    return {
      windowsObject,
    };
  },
  data() {
    return {
      loadingProgress: 0,
      showAvailable: ref(false),
    };
  },
  mounted() {},
  computed: {
    returnloadingProgress() {
      return this.loadingProgress;
    },
            lightBoxEffectMode() {
      return this.$store.state.Fozzy3D;
    },
  },
  watch: {
    loadingProgress: function () {
      if (this.loadingProgress >= 1) {
        gsap.to("#loading", {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            this.showAvailable = true;
          },
        });
        gsap.to("#DiningTable3D", { opacity: 1, duration: 2 });
        gsap.to("#DiningTable2D", { opacity: 1, duration: 2 });
      }
    },
        lightBoxEffectMode: function () {
      switch (this.lightBoxEffectMode) {
        case true:
          gsap.fromTo(
            "#DiningTable3D",
            { webkitFilter: "brightness(1)", filter: "brightness(1)" },
            {
              webkitFilter: "brightness(0.6)",
              filter: "brightness(0.6)",
              duration: 1,
            }
          );
          break;
        case false:
          gsap.fromTo(
            "#DiningTable3D",
            { webkitFilter: "brightness(0.6)", filter: "brightness(0.6)" },
            {
              webkitFilter: "brightness(1)",
              filter: "brightness(1)",
              duration: 1,
            }
          );
          break;
      }
    },
  },
  methods: {
    getLoadingProgress(val) {
      this.loadingProgress = val;
    },
  },
};
</script>

<style scoped>
#loading {
  position: fixed;
  z-index: 200;
  height: 100vh;
  width: 100vw;
}
#Pisirian3D #Pisirian2D {
  opacity: 0;
}
</style>
