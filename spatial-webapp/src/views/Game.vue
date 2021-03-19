<template>
  <div class="bg-green-500">
    <h1>This is where the spatial game goes</h1>
    <button class="bg-red-300 py-2 px-4 bg-light-blue-500 text-white font-semibold rounded-lg" @click="initGame">Start</button>
    <spatial :players="players" @select-pos="currentPlayer" :game="game" v-if="gamestart"></spatial>
  </div>
</template>

<script>
import Spatial from '@/components/Spatial';
// @ is an alias to /src

export default {
  name: 'Game',
  components: {
    Spatial
  },
    data() {
    return { game: [], players : [], size : {x : 4, y: 4 } , gamestart : false,  currentPlayer : null} ;
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
      this.gamestart = true;
      this.game = this.createMatrix(this.size.x, this.size.y);
      console.log(this.game);
      this.game.forEach(m=>m.forEach(a=>{
        this.players.push(a);
        })
      )
    console.log(this.players);
    
    },
  },
}
</script>
