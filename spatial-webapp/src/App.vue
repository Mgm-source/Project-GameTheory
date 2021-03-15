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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
