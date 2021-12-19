<template>
  <div class="fullViewPage">
    <MarketView id="MarketView"></MarketView>
    <Navigate id="Navigate"></Navigate>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import MarketView from "../components/market/market.vue";
import Navigate from "../components/market/navigate.vue";

export default defineComponent({
  name: "MarketPage",
  components: {
      MarketView: MarketView,
    Navigate: Navigate,
    
  },
});
</script>
<style lang="scss">
#MarketView {
  z-index: 2;
  position: relative;
}
.fullViewPage{
    position: relative;
}
</style>
