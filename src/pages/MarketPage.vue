<template>
  <div class="fullViewPage">
    <MarketView  id="MarketView"></MarketView>
    <Navigate id="Navigate" v-if="1"></Navigate>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import store from "../store";
import "../components/market/loading";
import MarketView from "../components/market/market.vue";
import Navigate from "../components/market/navigate.vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "MarketPage",
  components: {
    MarketView: MarketView,
    Navigate: Navigate,
  },
  setup() {


  },
  watch: {},
  data() {
    return {
      progressPercent: ref(0),
    };
  },
  computed: {},
  methods: {},
});
</script>
<style lang="scss">
#MarketView {
  z-index: 2;
  position: relative;
}
.fullViewPage {
  position: relative;
}
</style>
