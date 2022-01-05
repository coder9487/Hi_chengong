<template>
  <div id="navigator_group">
    <img
      src="images/npc.png"
      class="navigator_image"
      alt=""
      v-if="this.textIndex <= 1"
    />

    <div class="navigator_chatbox">
      <q-card id="chat_card_1" class="chat_card" v-if="this.textIndex == 0">
        <q-card-section>
          <img class="text_size" :src="textContentAccess(0)" />
          <q-btn
            id="chatContentButton"
            flat
            round
            :size="$q.platform.is.mobilexl ? sm : xl"
            icon="play_circle"
            @click="changeText()"
          />
        </q-card-section>
      </q-card>

      <q-card id="chat_card_2" class="chat_card" v-if="this.textIndex == 1">
        <q-card-section>
          <img class="chat_icon" src="images/UI/text_2_icon.svg" alt="" />
          <img :src="textContentAccess(1)" class="text_size" />
          <q-btn
            id="chatContentButton_2"
            flat
            round
            :size="$q.platform.is.mobilexl ? sm : xl"
            icon="clear"
            @click="changeText()"
          />
        </q-card-section>
      </q-card>
    </div>
  </div>
  <div class = "control_pannle">
    <q-btn round  color="orange" icon="expand_more" />
    <q-btn round  color="orange" icon="expand_less" />
    <q-btn round  @click="right_rotate(0)" color="orange" icon="chevron_right" />
    <q-btn round  @click="right_rotate(1)" color="orange" icon="chevron_left" />
  </div>
</template>
<script>



export default {
  setup() {},
  data() {
    return {
      talkContent: ["./images/UI/text_1.svg", "./images/UI/text_2.svg"],
      textIndex: 0,
    };
  },
  methods: {
    changeText() {
      this.textIndex++;
      //if (this.textIndex + 1 > this.talkContent.length) this.textIndex = 0;
      console.log("return " + this.talkContent[this.textIndex]);

      // return talkContent[textIndex]
    },
    textContentAccess(index) {
      return this.talkContent[index];
    },
    right_rotate(flag){
      if(flag)
      this.$store.commit("setRotationRightTrue");
    else{
      this.$store.commit("setRotationRightFalse");
    }   
   }
  },
};
</script>
<style lang="scss">
@media screen and (max-device-width: 768px) {
  .view {
    width: 400px;
  }
}

.navigator_image {
  width: 13%;
  height: 38%;
  z-index: 50;
  right: 6%;
  bottom: 0;
  position: fixed;
}
.navigator_chatbox {
  z-index: 49;
  right: 20%;
  bottom: 0%;
  width: 26%;
  height: 40%;
  size: 15px;
  position: fixed;
}
.chat_card {
  border-radius: 20px;
}
#chatContentButton {
  left: 80%;
}
#chat_card_2 {
  float: left;
  margin-left: 20px;
  margin-top: 10%;
}
#chatContentButton_2 {
  position: relative;
  left: 80%;
  margin-bottom: 20%;
}
.text_size {
  width: 80%;
  margin-top: 5%;
}
.chat_icon {
  width: 20%;
}


.control_pannle{
  position: fixed;
  right: 5%;
  bottom: 5%;
  z-index: 40;
}
</style>
