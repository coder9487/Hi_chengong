<template>
  <div id="navigator_group">
    <img src="images/npc.png" class="navigator_image" alt="" v-if='this.textIndex <= 1' />

    <div class="navigator_chatbox">
      
      <q-card id = "chat_card_1" class="chat_card" v-if='this.textIndex == 0'>
        <q-card-section>
          <img :src="textContentAccess(0)" style="margin-top: 5%" />
          <q-btn
            id="chatContentButton"
            flat
            round
            size="xl"
            icon="play_circle"
            @click="changeText()"
          />
        </q-card-section>
      </q-card>


      <q-card id = "chat_card_2" class="chat_card" v-if='this.textIndex == 1'>
        <q-card-section>
          <img src="images/UI/text_2_icon.svg" alt="">
          <img :src="textContentAccess(1)" style="margin-top: 5%" />
          <q-btn
            id="chatContentButton_2"
            flat
            round
            size="xl"
            icon="clear"
            @click="changeText()"
          />
        </q-card-section>
      </q-card>





    </div>
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
  },
};
</script>
<style lang="scss">
.navigator_image {
  width: 236px;
  height: 337px;
  z-index: 50;
  right: 100px;
  bottom: 0;
  position: fixed;
}
.navigator_chatbox {
  z-index: 49;
  right: 350px;
  bottom: -100px;
  width: 500px;
  height: 500px;
  size: 15px;
  position: fixed;
}
.chat_card {
  border-radius: 20px;
}
#chatContentButton {
  left: 80%;
}
#chat_card_2
{
    float: left;
    margin-left: 20px;
    margin-top:10%
    
}
#chatContentButton_2
{
    position: relative;
    left: 80%;
    top:70%;
}
</style>
