<template>
  <transition-group tag="div" class="img-slider" name="slide" appear>
    <div v-for="number in [currentImg]" v-bind:key="number">
      <img
        :src="imgList[Math.abs(currentImg) % imgList.length]"
        @click="JumpToSences(Math.abs(currentImg) % imgList.length)"
      />
    </div>
  </transition-group>

  <q-btn
    class="switch_btn"
    color="primary"
    label="switch"
    @click="currentImg++"
  ></q-btn>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
  data() {
    return {
      currentImg: 0,
      imgList: [
        "../images/comicbook/comicbook1.png",
        "../images/comicbook/comicBook_P2.png",
        "../images/comicbook/comicBook_P3.png",
        "../images/comicbook/comicBook_P4.png",
      ],
    };
  },
  methods: {
    JumpToSences(index) {
      switch (index) {
        case 0:
          this.$router.push({ path: "/market-page" });
          break;
        case 1:
          this.$router.push({ path: "/pisirian" });
          break;
        case 2:
          this.$router.push({ path: "/lantern" });
          break;
        case 3:
          this.$router.push({ path: "/swordfish" });
          break;
      }
    },
  },
});
</script>
<style scoped lang="scss">
.switch_btn {
  position: fixed;
  bottom: 100px;
  right: 100px;
}

.img-slider {
  overflow: hidden;
  position: relative;
  height: 936px;
  width: 1766px;
}

.img-slider img {
  position: absolute;
  top: 0;
  left: 100px;
  bottom: 0;
  right: 100px;
  height: 936px;
  width: 1766px;
}

.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}






</style>
