<template>
  <video v-show="showVideo" id="FinishVideo">
    <source
      v-if="getMountofSwordfish > 1"
      src="../../../public/hitVideo.mp4"
      type="video/mp4"
    />
    <source v-else src="../../../public/failHitVideo.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  <div id="progressbar">
    <div id="progressbar-background">
      <div id="progressbar-line"></div>
    </div>
  </div>
  <div
    class="charactor"
    v-show="
      dialogContent_Array[dialogContent_Index] != '' &&
      dialogContent_Array[dialogContent_Index] != 'lottie'
        ? true
        : false
    "
  >
    <q-img class="charactor-image" src="images/a_kon_hi.png"></q-img>
    <div></div>
  </div>
  <div
    v-show="dialogContent_Array[dialogContent_Index] == 'lottie' ? true : false"
  >
    <div id="lottie-container-swordfish_tutorial"></div>
    <div id="lottie-container-a_kon">
      <div
        id="lottie-container-a_kon_hover"
        @click.stop="dialogContent_Index++"
        v-show="!showAkonHover"
      ></div>
      <!-- <div id="lottie-container-a_kon_normal" v-show="!showAkonHover"></div> -->
    </div>
  </div>
  <div v-show="dialogContent_Index >= 9">
    <img class="cupon" :src="imagesrc(dialogContent_Index - 9)" />
  </div>
  <div
    class="dialog"
    v-show="
      dialogContent_Array[dialogContent_Index] != '' &&
      dialogContent_Array[dialogContent_Index] != 'lottie' &&
      dialogContent_Array[dialogContent_Index] != 'hearvest'
        ? true
        : false
    "
  >
    <div>
      <div
        class="dialog-content"
        v-show="
          dialogContent_Array[dialogContent_Index] != '' &&
          dialogContent_Array[dialogContent_Index] != 'lottie'
            ? true
            : false
        "
      >
        <div
          class="dialog-content-text"
          v-html="dialogContent_Array[dialogContent_Index]"
        ></div>
      </div>

      <q-btn
        color="orange"
        class="dialog-button"
        @click.stop="dialogContent_Index++"
        >{{ dialogButton_Content[dialogContent_Index] }}</q-btn
      >
    </div>
  </div>
  <div class="hearvest" v-show="dialogContent_Index == 8 ? true : false">
    <div class="hearvest-content">
      <img
        v-if="getMountofSwordfish > 1"
        class="hearvest-content-image"
        src="../../../public/images/swordfish/result.png"
      />
      <img
        v-else
        class="hearvest-content-image"
        src="../../../public/images/swordfish/fail.png"
      />
      <div v-if="getMountofSwordfish > 1" class="hearvest-content-money">{{ hearvest * 10000 }}</div>
      <div v-if="getMountofSwordfish > 1" class="hearvest-content-voluem">{{ hearvest }}</div>
    </div>

    <q-btn
      color="orange"
      class="hearvest-content-button"
      @click.stop="dialogContent_Index++"
      >{{ dialogButton_Content[dialogContent_Index] }}</q-btn
    >
  </div>
</template>
<script>
import lottie from "lottie-web";
import { ref } from "vue";
import gsap from "gsap";

export default {
  setup() {
    return {
      debug: true,
    };
  },
  computed: {
    getMountofSwordfish() {
      return this.$store.state.Swordfish.swordfish;
    },
  },
  mounted() {},
  watch: {
    getMountofSwordfish: function () {
      console.log("getMountofSwordfish", this.getMountofSwordfish);
    },
    dialogContent_Index: function () {
      if (this.dialogContent_Index == 4) {
        this.changeLottie("swordfish_tutorial");
        this.changeLottie("a_kon_hover");
        this.changeLottie("a_kon_normal");
      }
      if (this.dialogContent_Index == 6) {
        this.$store.commit("Swordfish/ToggleGame");
        let progressNum = 0;
        let progressElement = document.querySelector("#progressbar-line ");
        let timeInter = 33;
        if (this.debug) timeInter = 0.1;

        this.timeoutProgressID = window.setInterval(() => {
          progressNum += 0.1;
          progressElement.style.width = progressNum + "%";
          if (progressNum > 100) {
            window.clearInterval(this.timeoutProgressID);
            this.dialogContent_Index++;
          }
        }, timeInter);
      }
      if (this.dialogContent_Index == 7) {
        this.calcResult();
        this.$store.commit("Swordfish/ToggleGame");
        this.showVideo = true;
        this.$emit("lightBoxEffect", "on");
        let videoObj = document.getElementById("FinishVideo");
        console.log("videoObj", videoObj);
        videoObj.width = window.outerWidth;
        videoObj.height = window.outerHeight;

        // this.timeout = setTimeout(() => {

        // }, 1000);
        // clearTimeout(this.timeout);
        videoObj.style.zIndex = "200";
        videoObj.play();
        videoObj.onended = () => {
          this.$emit("lightBoxEffect", "off");
          this.dialogContent_Index++;

          gsap.to("#FinishVideo", {
            duration: 0.5,
            brightness: 0,
            onComplete: () => {
              videoObj.style.zIndex = "-2";
            },
          });
        };
      }
      if (this.dialogContent_Index == 11) {
        this.$router.push("DiningTable");
      }
    },
  },
  data() {
    return {
      hearvest: 0,
      showVideo: ref(false),
      showAkonHover: ref(false),
      dialogContent_Index: 0,
      dialogContent_Array: [
        '來，阿公跟你說，<b style="color: #FEA30B;">鏢旗魚</b>是成功鎮特有的<b style="color: #FEA30B;">傳統技法</b>，從日治時期就傳入台灣囉~',
        '漁夫會舉著長<b style="color: #FEA30B;">4~6公尺</b>，重達<b style="color: #FEA30B;">18公斤</b>的鏢竿鏢旗魚，雖然辛苦，但鏢到的旗魚也特別好吃喔!',
        '鏢刺漁法對環境很<b style="color: #FEA30B;">友善</b>喔，漁夫每次只對單一大魚獵捕，大大<b style="color: #FEA30B;">減少誤捕</b>小魚或保育類的機會!',
        '阿公先帶你練習一次，認真學喔!旗魚的<b style="color: #FEA30B;">價值不斐</b>，你鏢中越多，越會有意想不到的<b style="color: #FEA30B;">收穫</b>喔!',
        "lottie",
        '很好，待會旗魚可不會游得這麼慢喔! 你有<b style="color: #FEA30B;">30秒</b>的體驗時間，把握機會，旗魚可是不等人的喔!',
        "",
        "video",
        "hearvest",
        '哇!不愧是我的孫子，阿公送你一張<b style="color: #FEA30B;">成功折價卷</b>，等體驗結束後記得到櫃檯領取喔!',
        '辛苦後的結晶總是特別香甜，阿公帶你去吃一頓「<b style="color: #FEA30B;">成功大餐</b>」，都是成功道地料理喔!',
      ],
      dialogButton_Content: [
        "這~麼厲害",
        "我也可以嗎",
        "我也想試試",
        "我準備好了",
        "",
        "開始體驗",
        "",
        "",
        "哇!好棒",
        "這~麼厲害",
        "想吃!走吧!",
      ],
    };
  },
  methods: {
    calcResult() {
      this.hearvest = this.$store.state.Swordfish.swordfish;
    },
    toggleshowAkonHover() {
      console.log("Toggle toggleshowAkonHover");
      this.showAkonHover = !this.showAkonHover;
    },
    imagesrc(index) {
      let array = ["cupon.jpg", "table.png"];
      return `../../images/swordfish/${array[index]}`;
    },
    changeLottie(str) {
      this.lottieAnimation = lottie.loadAnimation({
        container: document.getElementById(`lottie-container-${str}`),
        renderer: "canvas", // 渲染方式:svg、canvas
        loop: true, //循环播放，默认：false
        autoplay: true, //自动播放 ，默认true
        path: `../../lottie/${str}.json`, // json 路径
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.charactor {
  &-image {
    bottom: 0;
    right: 5vw;
    width: 30vw;
    height: auto;
    position: fixed;
  }
}
.dialog {
  width: 40vw;
  height: 15vh;
  position: fixed;
  bottom: 15vh;
  background-color: aliceblue;
  left: 30vw;
  border-radius: 30px;
  flex-direction: column;
  display: flex;

  &-content {
    margin: 5% 5%;

    &-text {
      font-size: 2.5vh;
    }
  }

  &-button {
    left: 35%;
    top: -20px;
    justify-content: space-around;
    width: 180px;
    height: 40px;
    position: relative;
    border-radius: 20px;
  }
}

.hearvest {
  position: absolute;
  left: 25vw;
  display: flex;
  bottom: 20vh;
  display: block;

  &-content {
    position: relative;
    width: 50vw;
    height: auto;
    // border-radius: 30px;

    &-image {
      width: 50vw;
    }
    &-money {
      position: absolute;
      margin-top: -50%;
      margin-left: 25%;
      font-weight: bolder;
      font-size: 8vw;
      color: #ffa400;
    }
    &-voluem {
      position: absolute;
      margin-top: -20%;
      margin-left: 13%;
      font-weight: bolder;
      font-size: 5vw;
      color: #0fa3b0;
    }

    &-button {
      position: relative;
      margin: auto;
      bottom: 0;
      left: 45%;
    }
  }
}

#lottie-container {
  &-swordfish_tutorial {
    width: 40vw;
    height: 15vh;
    position: fixed;
    bottom: 5vh;
    left: 30vw;
  }

  &-a_kon {
    position: fixed;
    right: -10vw;
    bottom: 0vh;
    // background-color: beige;

    &_normal &_hover > canvas {
      height: 100vh;
    }
    // &_normal {

    // }
  }
}

#progressbar {
  $progressbar_height: 30px;
  $progressbar_border_radius: 20px;

  position: absolute;
  top: 5vh;
  width: 80vw;
  left: 10vw;
  display: flex;
  background-color: white;
  border-radius: $progressbar_border_radius;
  padding: 5px;
  &-background {
    background-color: #ffd29d;
    width: 100%;
    height: $progressbar_height;
    border-radius: $progressbar_border_radius;
  }
  &-line {
    background-color: #ffa400;
    width: 0%;
    /* Adjust with JavaScript */
    height: $progressbar_height;
    border-radius: $progressbar_border_radius;
  }
}

#FinishVideo {
  width: 100vw;
  height: 100vh;
  position: fixed;
}

.cupon {
  width: 40vw;

  position: fixed;
  bottom: 35vh;
  background-color: aliceblue;
  left: 30vw;
}
</style>
