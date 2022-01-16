<template>
  <div id = "IndexPageGroup">
    <img id="StartBackgroung" src="images/start.jpg" />
    <img class="start_btn" src="images/UI/startBtn.png" @click="playVideo()" />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageIndex",
  methods: {
    playVideo() {
      this.$router.push({ path: "/startVideo" });
    },
  },
});
</script>
<style scoped>
.start_btn {
  margin-top: -15%;
  margin-left: 39%;
  width: 20%;
  position: absolute;
  z-index: 1;
}
#StartBackgroung {
  width: 100vw;
  overflow-y: hidden;
  display: flex;
  position: relative;
}
#IndexPageGroup{
position: relative;


}
</style>
