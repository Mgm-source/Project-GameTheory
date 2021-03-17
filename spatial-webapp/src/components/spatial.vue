<template>
  <button class="bg-white hover:bg-blue-500 text-blue-700 font-semibold
                 hover:text-white py-2 px-4 border border-blue-500" @click="initGame">
    test
 </button>
</template>

<script>
export default {
  name: "SpatialGameLogic",
  components: {},

  data() {
    return { game: [] };
  },
  methods: {
    createMatrix(x, y) {
      let gameMatrix = [];
      let count = 0;
      for (let i = 0; i < y; i++) {
        let row = [];
        for (let j = 0; j < x; j++) {
          row.push({ strategy: "", payOff: 0, id: count++ });
        }
        gameMatrix.push(row);
      }
      return gameMatrix;
    },
    initGame() {
      this.game = new this.createMatrix(4, 4);
      console.log(this.game);
      this.game.forEach((d,i)=>{
          d.forEach((a)=>console.log(a,i))
        })
    },
  },
};
</script>

<style>
</style>