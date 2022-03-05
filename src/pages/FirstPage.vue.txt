<template>
  <q-page class="flex flex-center">
    <ComicBook></ComicBook>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import ComicBook from "../components/ComicBook.vue"

export default defineComponent({
  name: 'FirstPage',
  components: {
    ComicBook: ComicBook,

  }
})
</script>
