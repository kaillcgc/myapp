<template>
  <div class="carousel-wrapper">
    <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <img
        v-for="(slide, index) in slides"
        :key="index"
        :src="slide.img"
        :alt="`Slide ${index + 1}`"
        class="carousel-slide"
      />
    </div>
    <button class="carousel-button prev-button" @click="prevSlide">&#10094;</button>
    <button class="carousel-button next-button" @click="nextSlide">&#10095;</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const slides = [
  { img: new URL('@/assets/img/937.png', import.meta.url).href },
  { img: new URL('@/assets/img/150703092054_562.jpg', import.meta.url).href },
  { img: new URL('@/assets/img/1703749460468_KDZQYaTm.png', import.meta.url).href }
]

const currentIndex = ref(0)
let timer = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + slides.length) % slides.length
}

onMounted(() => {
  timer = setInterval(() => {
    nextSlide()
  }, 3000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.carousel-wrapper {
  position: relative;
  overflow: hidden;
  width: 800px;
  height: 400px;
  margin: 0 auto;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 50%;
  z-index: 10;
}

.prev-button {
  left: 10px;
}

.next-button {
  right: 10px;
}

.carousel-button:hover {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>