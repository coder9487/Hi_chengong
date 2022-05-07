<template>
  <div>
    <div>ScreenOrientation:{{ ScreenOrientation }}</div>
    <div>DeviceOrientation{{ DeviceOrientation.alpha }}</div>
    <div>DeviceOrientation{{ DeviceOrientation.beta }}</div>
    <div>DeviceOrientation{{ DeviceOrientation.gamma }}</div>
    <div id="alpha"></div>
    <div id="beta"></div>
    <div id="gamma"></div>
  </div>
</template>
<script>
import { reactive, ref } from "vue";

export default {
  setup() {},
  data() {
    return {
      ScreenOrientation: reactive({}),
      DeviceOrientation: {},
    };
  },
  mounted() {

    window.addEventListener('deviceorientation', function(event) {
  var a = document.getElementById('alpha'),
          b = document.getElementById('beta'),
          g = document.getElementById('gamma'),
          alpha = event.alpha,
          beta = event.beta,
              gamma = event.gamma;

  a.innerHTML = Math.round(alpha);
  b.innerHTML = Math.round(beta);
  g.innerHTML = Math.round(gamma);

    }, false);


    window.addEventListener(
      "orientationchange",
      this.onScreenOrientationChangeEvent,
      false
    );

    window.addEventListener(
      "deviceorientation",
      this.onDeviceOrientationChangeEvent,
      false
    );
  },
  methods: {
    onScreenOrientationChangeEvent(event) {
      this.ScreenOrientation = event;
      console.log("ScreenOrientation", event);
    },
    onDeviceOrientationChangeEvent(event) {
      this.DeviceOrientation = event;
      console.log("DeviceOrientation", event);
    },
  },
};
</script>
<style lang="scss" scoped></style>
