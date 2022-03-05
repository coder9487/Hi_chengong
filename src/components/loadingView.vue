<template>
  <div id="loading-content">



  </div>
</template>
<script>
export default {
  setup() {

  },
  props:["loadingProgressPercentage"],
  watch:{
    loadingProgressPercentage:function()
    {
      console.log('Loading precentage',this.loadingProgressPercentage)
    }

  }
}
</script>
<style scoped lang="scss">
#loading-content{
  position: fixed;
  background-color: aqua;
  width: 10vw;
  height: 10vh;
}
</style>
