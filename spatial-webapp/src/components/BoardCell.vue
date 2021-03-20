<template>
  <div class="bg-blue-500 h-12 rounded-md flex items-center justify-center text-white text-2xl font-extrabold hover:bg-red-700" @click="playerStatus">
    <i>{{player.strategy}} : {{player.payOff}}</i>
  </div>
</template>

<script>
export default {
  name : "MatrixCell",
  props : {
    player : {type : Object, required : true },
  },
  computed : {
   // row() {return `board-cell-row-${Math.floor(this.player.id / this.size)}`},
   // col() {return `board-cell-col-${this.player.id % this.size}`}
  },
  methods : {
    playerStatus(event){
      this.$emit('select-cell',event,this.player);
    }
  }
}
</script>

<style>
</style>