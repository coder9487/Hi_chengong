<template>
  <div id="book" class="book">
    <div class="page back" id="page-8">
      <div class="front-face">PAGE 8</div>
      <div class="back-face">BYE</div>
    </div>

    <div class="page page6" id="page-7">
      <div class="front-face">PAGE 7</div>
      <div class="back-face"></div>
    </div>

    <div class="page page5" id="page-6">
      <div class="front-face">PAGE 6</div>
      <div class="back-face"></div>
    </div>

    <div class="page page4" id="page-5">
      <div class="front-face">PAGE 5</div>
      <div class="back-face"></div>
    </div>

    <div class="page page3" id="page-4">
      <div class="front-face">PAGE 4</div>
      <div class="back-face"></div>
    </div>

    <div class="page page2" id="page-3">
      <div class="front-face">PAGE 3</div>
      <div class="back-face"></div>
    </div>
  </div>
  <q-btn color="orange" label="Click" @click="flipPage"></q-btn>
</template>
<script>
export default {
  data() {
    return
    {
       page: 1
       timerId: null
    }
  },
  methods: {
    toggleClass(id, cssClass) {
      document.getElementById(id).classList.toggle(cssClass);
    },

    flipPage() {
      if (this.page === 1) {
        this.toggleClass("book", "two-pages");
      } else if (this.page === 8) {
        this.toggleClass("book", "closed");
        this.toggleClass("book", "two-pages");
        clearInterval(this.timerId);
      }

      this.toggleClass("page-" + this.page, "flipped");
      this.page++;
    },
  },
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --page-width: 40vw;
  --transition-speed: 2s;
}

body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  perspective: 400vw;
  background: #ccc;
}

body,
.page > div {
  display: flex;
  align-items: center;
  justify-content: center;
}

#book,
.page {
  width: var(--page-width);
  height: 80vh;
}

#book {
  transform-style: preserve-3d;
  backface-visibility: visible;
  flex-shrink: 0;
  transition: var(--transition-speed) all ease;
  position: relative;
  margin: 0 auto;
}

#book.two-pages {
  width: calc(2 * var(--page-width));
}

#book.closed {
  width: calc(3 * var(--page-width));
}

.front,
.back {
  background: navy;
}

.page {
  background: white;
  border: 1px solid red;
  position: absolute;
  right: 0;
}

div.page.flipped {
  transform: rotateY(180deg);
  transition: transform var(--transition-speed);
  transform-origin: left center;
}

.page > div {
  position: absolute;
  width: 100%;
  height: 100%;
}

.page > div.back-face {
  opacity: 0;
}

.page.flipped > div.front-face {
  transition-property: opacity;
  transition-delay: calc(0.3 * var(--transition-speed));
  opacity: 0;
}

.page.flipped > div.back-face {
  opacity: 0;
}

.page.flipped > div.back-face {
  transition-property: opacity;
  transition-delay: calc(0.3 * var(--transition-speed));
  opacity: 1;
}

#page-1.flipped {
  transform: rotateY(-180.04deg);
}

#page-2.flipped {
  transform: rotateY(-180.03deg);
}

#page-3.flipped {
  transform: rotateY(-180.02deg);
}

#page-4.flipped {
  transform: rotateY(-180.01deg);
}

#page-5.flipped {
  transform: rotateY(-180deg);
}

#page-6.flipped {
  transform: rotateY(-179.99deg);
}

#page-7.flipped {
  transform: rotateY(-179.98deg);
}

#page-8.flipped {
  transform: rotateY(-179.97deg);
}
</style>
