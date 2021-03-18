<template>
 <div v-if="size.x >= 2 && size.y >= 2">
       <button class="bg-white hover:bg-blue-500 text-blue-700 font-semibold
                 hover:text-white py-2 px-4 border border-blue-500" @click="initGame" v-if="visible">
    test
 </button>
 <div v-for="player in players" :key="player.id">
    <input type="text" v-model="player.strategy"> Id: {{player.id}}
 </div>
 </div>
 <div v-else>
     X : <input type="text" v-model="size.x"> 
     Y : <input type="text" v-model="size.y">
 </div>
</template>

<script>
export default {
  name: "SpatialGameLogic",
  components: {},

  data() {
    return { game: [], players : [], size : {x : 0, y: 0 } , visible : true};
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
    initGame(event) {
        console.log(event);
        this.visible = !this.visible;
      this.game = this.createMatrix(this.size.x, this.size.y);
      console.log(this.game);
      this.game.forEach(m=>m.forEach(a=>{
          this.players.push(a);
          })
          )
          console.log(this.players);
    },
  },
};
</script>

<style>
</style>