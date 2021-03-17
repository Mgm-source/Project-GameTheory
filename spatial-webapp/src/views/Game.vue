<template>
  <div class="bg-green-500">
    <h1>This is where the spatial game goes</h1>
    <spatial></spatial>
  </div>
</template>

<script>
import Spatial from '../components/spatial.vue'
// @ is an alias to /src

export default {
  name: 'Game',
  components: {
    Spatial
  }
}
</script>
