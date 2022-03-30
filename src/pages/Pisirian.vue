<template>
  <div>
    <loading
      id="loading"
      :LoadingProgress="returnloadingProgress"
      v-if="!showAvailable"
    ></loading>
    <Pisirian3D
    id="Pisirian3D"
      @loadingProgress="getLoadingProgress"
    ></Pisirian3D>
  </div>
</template>

<script>
import Pisirian3D from "../components/Pisirian/Pisirian3D.vue";
import loading from "../components/loadingView.vue";
import { ref } from "vue";
import gsap from "gsap";
export default {
  name: "three",
  components: { Pisirian3D, loading },
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
        gsap.to("#loading", {opacity:0, duration: 0.5,onComplete:()=>{this.showAvailable = true;}});
        gsap.to("#Pisirian3D", {opacity:1, duration: 2,})
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
#Pisirian3D{
  opacity: 0;
}
</style>
