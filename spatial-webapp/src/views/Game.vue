<template>
  <div class="h-screen w-screen">
    <div id="menu" class="m-1 relative rounded-md shadow-sm w-1/4">
      <label for="strats" class="block text-sm font-medium text-gray-700">Add more strategies?</label>
      <input id="strats" type="text" name="stats" class="focus:ring-indigo-500 focus:border-indigo-500 block  pl-7 pr-1 sm:text-lg border-gray-300 rounded-md" maxlength="1" v-model="strategy"/>
      <button class="absolute inset-y-0 right-0 items-center spx-4 font-bold text-white bg-indigo-600 rounded-r-lg hover:bg-indigo-500 focus:bg-indigo-700" @click="addStrat">Add</button>
        <label for="strategy">Strategies:</label>
        <ul id="strategy" name="strategy" class="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md" >
          <div v-for="(strategy, index) in statPermutations" :key="index" class="p-4 mb-3 flex justify-between items-center bg-white shadow rounded-lg cursor-move">
            {{ strategy.outcome }}
            <label for="dValue">value:</label>
          <input type="number" name="value" id="dValue" :value="strategy.value = index ">
          </div>
        </ul>
    </div>
    <h1>This is where the spatial game information graph and stats goes</h1>
    <button class="bg-yellow-500 py-2 px-4 bg-light-blue-500 text-white font-semibold rounded-lg" @click="initGame">
    Start
    </button>
    <spatial class="m-8" :players="players" @select-pos="currentPlayer" :game="game" v-if="gamestart"></spatial>
  </div>
</template>

<script>
import Spatial from "@/components/Spatial";
// @ is an alias to /src

export default {
  name: "Game",
  components: {
    Spatial,
  },
  data() {
    return {
      game: [],
      players: [],
      size: 10,
      gamestart: false,
      currentPlayer: null,
      strategies: ["C", "D"],
      strategy: "",
      playOffValues: [],
    };
  },
  computed: {
    statPermutations() {
      return this.strategies
        .map((current, i, array) => {
          let perm = [];
          for (let index = 0; index < this.strategies.length; index++) {
            const denomation = current + array[index];
            perm.push({ outcome: denomation, value: 0 });
          }
          return perm;
        })
        .flat();
    },
  },
  methods: {
    createMatrix(size) {
      let gameMatrix = [];
      let count = 0;
      for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
          row.push({ strategy: "", payOff: 0, id: count++ });
        }
        gameMatrix.push(row);
      }
      return gameMatrix;
    },
    initGame() {
      this.gamestart = true;
      this.game = this.createMatrix(this.size);
      this.playOffValues = this.statPermutations;

      this.game.forEach((matrix) =>
        matrix.forEach((player) => {
          player.strategy = this.strategies[Math.floor(Math.random() * this.strategies.length)];
          this.players.push(player);
        })
      );

      this.checkStrategy();
      console.log(this.players);

      // let numOfPerm =;
      // console.log(numOfPerm);
    },
    checkStrategy() {
      //const neighbours = [[0, 1],[1, 0],[0, -1],[-1, 0]];
      this.game.forEach((matrix, i) => {
        matrix.forEach((player, j) => {
          this.checkneighbours(i, j, player);
        });
      });
    },
    checkneighbours(i, j, player) {
      const westPlayerStat =  j > 0 ? player.strategy + this.game[i][j - 1].strategy : "";
      const eastPlayerStat =  j < this.game.length - 1 ? player.strategy + this.game[i][j + 1].strategy  : "";
      const northPlayerStat = i > 0 ? player.strategy + this.game[i - 1][j].strategy : "";
      const southPlayerStat = i < this.game.length - 1  ? player.strategy + this.game[i + 1][j].strategy : "";

      this.playOffValues.forEach((state) => {
        if (westPlayerStat !== "") {
          if (state.outcome == westPlayerStat) {
            player.payOff += state.value;
          }
        }
        if (eastPlayerStat !== "") {
          if (state.outcome == eastPlayerStat) {
            player.payOff += state.value;
          }
        }
        if (northPlayerStat !== "") {
          if (state.outcome == northPlayerStat) {
            player.payOff += state.value;
          }
        }
        if (southPlayerStat !== "") {
          if (state.outcome == southPlayerStat) {
            player.payOff += state.value;
          }
        }
      });
      // right
      // if (j < this.game.length - 1) {
      //   if (game[i][j + 1].strategy == "C" && game[i][j].strategy == "C") {
      //     game[i][j].payOff += 4;
      //   }

      //   if (game[i][j + 1].strategy == "D" && game[i][j].strategy == "C") {
      //     game[i][j].payOff += 0;
      //   }
      //   if (game[i][j + 1].strategy == "C" && game[i][j].strategy == "D") {
      //     game[i][j].payOff += 3;
      //   }
      //   if (game[i][j + 1].strategy == "D" && game[i][j].strategy == "D") {
      //     game[i][j].payOff += 2;
      //   }
      // }
      // left
      // if (j > 0) {
      //   if (game[i][j - 1].strategy == "C" && game[i][j].strategy == "C") {
      //     game[i][j].payOff += 4;
      //   }
      //   if (game[i][j - 1].strategy == "D" && game[i][j].strategy == "C") {
      //     game[i][j].payOff += 0;
      //   }
      //   if (game[i][j - 1].strategy == "C" && game[i][j].strategy == "D") {
      //     game[i][j].payOff += 3;
      //   }
      //   if (game[i][j - 1].strategy == "D" && game[i][j].strategy == "D") {
      //     game[i][j].payOff += 2;
      //   }
      // }

      // down
      // if (i < this.game.length - 1) {
      //   if (game[i + 1][j].strategy == "C" && game[i][j].strategy == "C") {
      //     game[i][j].payOff += 4;
      //   }
      //   if (game[i + 1][j].strategy == "D" && game[i][j].strategy == "C") {
      //     game[i][j].payOff += 0;
      //   }
      //   if (game[i + 1][j].strategy == "C" && game[i][j].strategy == "D") {
      //     game[i][j].payOff += 3;
      //   }
      //   if (game[i + 1][j].strategy == "D" && game[i][j].strategy == "D") {
      //     game[i][j].payOff += 2;
      //   }
      // }
      // up
      // if (i > 0) {
      //   if (game[i - 1][j].strategy == "C" && game[i][j].strategy == "C") {
      //     game[i][j].payOff += 4;
      //   }
      //   if (game[i - 1][j].strategy == "D" && game[i][j].strategy == "C") {
      //     game[i][j].payOff += 0;
      //   }
      //   if (game[i - 1][j].strategy == "C" && game[i][j].strategy == "D") {
      //     game[i][j].payOff += 3;
      //   }
      //   if (game[i - 1][j].strategy == "D" && game[i][j].strategy == "D") {
      //     game[i][j].payOff += 2;
      //   }
    },
    addStrat() {
      if (this.strategy != "") {
        this.strategies.push(this.strategy.toUpperCase());
      }
    },
  },
};
</script>
