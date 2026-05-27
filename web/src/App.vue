<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  if (localStorage.getItem('token')) {
    authStore.getProfile()
  }
})
</script>

<template>
  <router-view />
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>