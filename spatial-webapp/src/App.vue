<template>
  <div>
      <router-link :to="{name : 'Home' }">Home</router-link> | 
      <router-link :to="{name : 'About' }">About</router-link>
  </div>
  
  <router-view>
  </router-view>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
</style>
