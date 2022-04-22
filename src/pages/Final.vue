<template>
  <div id="pan" v-touch-pan.prevent="direciton">

    {{direc}}
  </div>
</template>
<script>
import { reactive } from "vue";
export default {
  setup() {},
  data() {
    return {
      movingEvent: { clientX: 0, clientY: 0, screenX: 0, screenY: 0 },
      delta: { time: 0, x: 0, y: 0 },
      direc : reactive({ hori: 0, vert: 0 }),
    };
  },
  mounted() {
    this.startup();
  },
  methods: {
    startup() {
      let el = document.getElementById("pan");
      el.addEventListener("touchstart", this.touchStart, false);
       el.addEventListener("touchend", this.touchEnd, false);
      el.addEventListener("touchcancel", this.touchEnd, false);
      el.addEventListener("touchmove", this.handleMove, false);
      console.log("initialized.");
    },
        direciton({ evt, ...newInfo }) {
      this.direc.hori = newInfo.delta.x.toFixed(0);
      this.direc.vert = newInfo.delta.y.toFixed(0);

      if (newInfo.isFirst) {
      } else if (newInfo.isFinal) {
        this.direc.hori = 0;
        this.direc.vert = 0;
      }
    },
    handleMove(event) {
      if (event.changedTouches[0].timeStamp != this.delta.time) {
        this.delta.time = event.changedTouches[0].timeStamp - this.timeStemp;
        this.delta.x =
          (this.movingEvent.screenX - event.changedTouches[0].screenX).toFixed(2);
        this.delta.y =
          (this.movingEvent.screenY - event.changedTouches[0].screenY).toFixed(2);
          // this.delta.x  = this.delta.x > 0.01 ? this.delta.x :0;
          // this.delta.y  = this.delta.y > 0.01 ? this.delta.y :0;
        this.movingEvent.screenX = event.changedTouches[0].screenX.toFixed(2);
        this.movingEvent.screenY = event.changedTouches[0].screenY.toFixed(2);
      }

      console.log(this.movingEvent);
    },

    touchStart(event) {
      this.delta.time = event.timeStamp
      console.log(event.timeStamp)
    },
    touchEnd(){
      this.movingEvent =  { clientX: 0, clientY: 0, screenX: 0, screenY: 0 };
      this.delta =  { time: 0, x: 0, y: 0 };
    }
  },
  components: {},
};
</script>
<style lang="scss" scoped>
#pan {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;

  background-color: aquamarine;
}
</style>
