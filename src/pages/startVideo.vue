<template>
<video id = "startUpVedio" autoplay @ended="videoEnd" >
  <source src="../video/open.mp4" type="video/mp4">
  </video>
</template>

<script  >

export default {

methods:{
  videoEnd()
  {
    this.$router.push('/ComicBook')
  }
}
};


</script>

<style scoped>
#startUpVedio
{
    width: 100%;
    height: 100%;
}
</style>