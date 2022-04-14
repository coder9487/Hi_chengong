<template>
  <div>
    <loading
      id="loading"
      :LoadingProgress="returnloadingProgress"
      v-if="!showAvailable"
    ></loading>

    <DiningTable3D
      id="swordfish3D"
      @loadingProgress="getLoadingProgress"
    ></DiningTable3D>
    <DiningTable2D v-if="1"></DiningTable2D>
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
        gsap.to("#Pisirian3D", { opacity: 1, duration: 2 });
        gsap.to("#Pisirian2D", { opacity: 1, duration: 2 });
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
