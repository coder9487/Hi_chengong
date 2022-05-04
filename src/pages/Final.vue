<template>
<div class="button"></div>
  <div class="mainPage" id="page1">
    <img class="background-photo" src="../../public/images/final/market.jpeg" />
    <div class="infoArea"></div>
  </div>
    <div class="mainPage" id="page2">
    <img class="background-photo" src="../../public/images/final/pisirian.jpeg" />
    <div class="infoArea"></div>
  </div>
      <div class="mainPage" id="page3">
    <img class="background-photo" src="../../public/images/final/swordfish.jpeg" />
    <div class="infoArea"></div>
  </div>
</template>
<script>
export default {
  setup() {},
};
</script>
<style lang="scss" scoped>
.background-photo {
  position: absolute;
  margin: 0;
  width: 100vw;
  height: 100vh;
  filter: blur(5px);
}
.infoArea {
  position: fixed;
  // background-color: blueviolet;
  left: 10vw;
  top: 15vh;
  height: 70vh;
  width: 80vw;
}
.button{
  width: 50px;
  height: 50px;
  border-radius: 25px ;
  background-color: aquamarine;
  right:5vw;
  position: fixed;
  top:50vh;
  z-index: 10;

}
.mainPage{

  transition: 1s;
}
</style>
