<template>
  <div>
    <div>ScreenOrientation:{{ ScreenOrientation }}</div>
    <div>DeviceOrientation{{ DeviceOrientation.x }}</div>
    <div>DeviceOrientation{{ DeviceOrientation.y }}</div>
    <div>DeviceOrientation{{ DeviceOrientation.z }}</div>
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

let magSensor = new Magnetometer({frequency: 60});

magSensor.addEventListener('reading', e => {
  this.DeviceOrientation = magSensor
  console.log("Magnetic field along the X-axis " + magSensor.x);
  console.log("Magnetic field along the Y-axis " + magSensor.y);
  console.log("Magnetic field along the Z-axis " + magSensor.z);
});



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
