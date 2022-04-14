<template>
  <div>
    <div class="introduceBox" >
      <img  class="introduceBox-photo" :src="imagepath" />
      <img
        class="introduceBox-close"
        src="../../../public/images/diningtable/icon_close.png"
        @click.stop="resetShowenable"
      />
    </div>
  </div>
</template>
<script>
import gsap from "gsap";
import { ref } from "vue";
export default {
  setup() {},
  data() {
    return {
      showEnable: false,
      imagepath: ref(""),
    };
  },
  computed: {
    getDish() {
      return this.$store.state.DiningTable.dish;
    },
  },
  watch: {
    getDish: function () {
      if (this.getDish != "") {
        this.showEnable = true;
        this.imagepath = this.getimagepath();
      } else {
        this.showEnable = false;
      }

      if (this.showEnable == true)
        gsap.fromTo(
          ".introduceBox",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
          }
        );
      else {
        gsap.fromTo(
          ".introduceBox",
          { opacity: 1 },
          {
            opacity: 0,
            duration: 0.5,
          }
        );
      }
    },
  },
  methods: {
    getimagepath() {

       let imagesUrl = (`../../images/diningtable/${this.getDish}.png`)
       console.log("calling path ",imagesUrl)
       return imagesUrl

      return `../../../public/images/diningtable/${this.imagepath}.png`;
    },
    resetShowenable() {
      this.showEnable = false;
      this.$store.commit("DiningTable/resetDish");
    },
  },
};
</script>
<style lang="scss" scoped>
.introduceBox {
  opacity: 0;
  &-photo {
    position: absolute;
    z-index: 300;
    top: 17vh;
    left: 13vw;
    width: 73vw;
    // height: 66vh;
    // background-color: bisque;
  }
  &-close {
    position: absolute;
    z-index: 300;
    top: 21vh;
    right: 17vw;
    width: 3vw;
    &:hover {
      opacity: 0.6;
    }
  }
}
</style>
