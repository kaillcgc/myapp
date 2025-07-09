<template>
  <div id="app">
    <app-header />
    <main>
      <router-view />
    </main>
    <div class="go-to-top" id="go-to-top-btn">
      <a href="#" @click.prevent="scrollToTop">
        <div class="underlined-text">⬆</div>
      </a>
    </div>
    <app-footer />
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<style>
body {
  margin: 0 auto;
  background-color: rgb(245, 245, 245);
}

html {
  scroll-behavior: smooth;
}
</style>