<template>
  <div id="IndexPageGroup">
    <img id="StartBackgroung" src="images/start.jpg" v-show="hideFlag" />
    <q-btn
      v-show="hideFlag"
      class="start_btn text-h5 text-weight-bolder"
      text-color="cyan-7"
      color="grey-1"
      @click="playVideo()"
      :size="$q.platform.is.desktop ? 'lg' : 'md'"
      >走！去成功</q-btn
    >
  </div>
  <video id="startUpVedio" @ended="videoFinish" @dblclick="videoDblcilck">
    <source src="../video/open.mp4" type="video/mp4" />
  </video>
  <div></div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageIndex",
  setup() {
    return {};
  },
  data() {
    return {
      hideFlag: true,
      clickEnable: false,
    };
  },
  methods: {
    videoFinish() {
      this.clickEnable = true;
    },
    videoDblcilck()
    {
        if(this.clickEnable)
        {
          this.$router.push('Market')
        }
    }
,
    playVideo() {
      this.hideFlag = false;
      var myVideo = document.getElementById("startUpVedio");
      myVideo.play();
    },
  },
});
</script>
<style scoped>
#startUpVedio {
  width: 100vw;
  height: auto;
  position: absolute;
  z-index: 2;
}

.start_btn {
  width: 20%;
  height: 10%;
  border-radius: 50px;
  position: absolute;
  bottom: 16%;
  right: 40vw;
  border: 20px ;
  z-index: 5;
}

#StartBackgroung {
  z-index: 4;
  width: 100vw;
  height: 100vh;
  overflow-y: hidden;
  display: flex;
  position: absolute;
}
</style>
