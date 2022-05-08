<template>
  <div>
    <div>ScreenOrientation:{{ ScreenOrientation }}</div>

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
