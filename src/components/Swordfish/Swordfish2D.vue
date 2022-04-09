<template>
  <div id="progressbar">
    <div id="progressbar-background">
      <div id="progressbar-line"></div>
    </div>
  </div>
  <div
    class="charactor"
    v-show="dialogContent_Array[dialogContent_Index] == 'lottie' ? false : true"
  >
    <q-img class="charactor-image" src="images/a_kon_hi.png"></q-img>
  </div>
  <div
    class="dialog"
    v-show="dialogContent_Array[dialogContent_Index] != '' && dialogContent_Array[dialogContent_Index] != 'lottie'? true : false"
  >
    <div class="dialog-content">
      <div
        class="dialog-content-text"
        v-html="dialogContent_Array[dialogContent_Index]"
      ></div>
      <q-btn
        color="orange"
        class="dialog-button"
        @click="dialogContent_Index++"
        >{{ dialogButton_Content[dialogContent_Index] }}</q-btn
      >
    </div>
  </div>
</template>
<script>
export default {
  setup() {},
  mounted() {},
  watch: {
    dialogContent_Index: function () {
      console.log(this.dialogContent_Index);
      if (this.dialogContent_Index == 2) {
        let progressNum = 0;
        let progressElement = document.querySelector("#progressbar-line ");
        this.timeoutProgressID = window.setInterval(() => {
          progressNum += 0.1;
          progressElement.style.width = progressNum + "%";
          if (progressNum > 100) {
            window.clearInterval(this.timeoutProgressID);
            this.dialogContent_Index++;

          }
        }, 33);
      }
    },
  },
  data() {
    return {
      dialogContent_Index: 0,
      dialogContent_Array: [
        '來，阿公跟你說，<b style="color: #FEA30B;">鏢旗魚</b>是成功鎮特有的<b style="color: #FEA30B;">傳統技法</b>，從日治時期就傳入台灣囉~',
        '阿公先帶你練習一次，認真學喔!旗魚的<b style="color: #FEA30B;">價值不斐</b>，你鏢中越多，越會有意想不到的<b style="color: #FEA30B;">收穫</b>喔!',
        'lottie',
        '很好，待會旗魚可不會游得這麼慢喔! 你有<b style="color: #FEA30B;">30秒</b>的體驗時間，把握機會，旗魚可是不等人的喔!',
        '',
        '',
      ],
      dialogButton_Content: ["這~麼厲害", "我準備好了", "", "開始體驗"],
    };
  },
};
</script>
<style lang="scss" scoped>
.charactor {
  &-image {
    bottom: 0;
    right: 10vw;
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
    top: 20px;
    justify-content: space-around;
    width: 180px;
    position: relative;
    border-radius: 10px;
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
</style>
