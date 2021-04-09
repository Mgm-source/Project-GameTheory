<template>
  <div class="h-screen w-screen">
    <div id="menu" class="m-1 relative rounded-md shadow-sm w-1/4">
      <label for="strats" class="block text-sm font-medium text-gray-700">Add more strategies?</label>
      <input id="strats" type="text" name="stats" class="focus:ring-indigo-500 focus:border-indigo-500 block  pl-7 pr-1 sm:text-lg border-gray-300 rounded-md" maxlength="1" v-model="strategy" placeholder="Enter a letter"/>
      <button class="absolute inset-y-0 right-0 items-center spx-4 font-bold text-white bg-indigo-600 rounded-r-lg hover:bg-indigo-500 focus:bg-indigo-700" @click="addStrat">Add</button>
        <label for="strategy">Strategies:</label>
        <ul id="strategy" name="strategy" class="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md" >
          <div v-for="(strategy, index) in statPermutations" :key="index" class="p-4 mb-3 flex justify-between items-center bg-white shadow rounded-lg">
            {{ strategy.outcome }}
            <label for="dValue">value:</label>
          <input type="number" name="value" id="dValue" v-model.number="statPermutations[index].value">
          </div>
        </ul>
    </div>
    <h1>This is where the spatial game information graph and stats goes</h1>
    <button class="bg-yellow-500 py-2 px-4 bg-light-blue-500 text-white font-semibold rounded-lg" @click="initGame">
    Start
    </button>
        <button class="bg-yellow-500 py-2 px-4 bg-light-blue-500 text-white font-semibold rounded-lg" @click="checkPlayOff">
    play
    </button>
    <spatial class="m-8" :players="players" @select-pos="currentPlayer" :game="game" v-if="gamestart">
    </spatial>
  </div>
</template>

<script>
import Spatial from "@/components/spatial";
import { mapState } from "vuex";
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
      size: 50,
      gamestart: false,
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
    ...mapState(["colours","gameStates"]),
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
          player.strategy = this.strategies[
            Math.floor(Math.random() * this.strategies.length)
          ];
          this.players.push(player);
        })
      );

      this.assignColours(this.colours);
      console.log(this.playOffValues);
      // make the function return true when all the players have been checked
      // while loop to for the game function
      this.checkStrategy();
      console.log(this.game);
      // let numOfPerm =;
      // console.log(numOfPerm);
    },
    checkPlayOff() {
      //const neighbours = [[0, 1],[1, 0],[0, -1],[-1, 0]];
      this.game.forEach((matrix, i) => {
        matrix.forEach((player, j) => {
          this.checkneighbours(i, j, player, "payOff",(leftP, rightP, aboveP, belowP, middleP, prop) => {
              if (leftP) {
                if (leftP.strategy !== middleP.strategy) {
                  if (middleP[prop] < leftP[prop]) {
                    middleP.strategy = leftP.strategy;
                  }
                }
              }
              if (rightP) {
                if (rightP.strategy !== middleP.strategy) {
                  if (middleP[prop] < rightP[prop]) {
                    middleP.strategy = rightP.strategy;
                  }
                }
              }
              if (aboveP) {
                if (aboveP.strategy !== middleP.strategy) {
                  if (middleP[prop] < aboveP[prop]) {
                    middleP.strategy = aboveP.strategy;
                  }
                }
              }
              if (belowP) {
                if (belowP.strategy !== middleP.strategy) {
                  if (middleP[prop] < belowP[prop]) {
                    middleP.strategy = belowP.strategy;
                  }
                }
              }
              // return a array
            }
          );
        });
      });
      this.checkStrategy();
      this.gameStates.push(this.game);
    },currentPlayer(k){
      let index = this.strategies.indexOf(k.strategy);
      console.log(this.gameStates);
      k.strategy = this.strategies[++index%this.strategies.length]
    },
    checkStrategy() {
      //const neighbours = [[0, 1],[1, 0],[0, -1],[-1, 0]];
      this.game.forEach((matrix, i) => {
        matrix.forEach((player, j) => {
          this.checkneighbours(i, j, player, "strategy", this.playerStat);
        });
      });
    },
    checkneighbours(i, j, player, prop, callback) {
      const westPlayer = j > 0 ? this.game[i][j - 1] : null;
      const eastPlayer = j < this.game.length - 1 ? this.game[i][j + 1] : null;
      const northPlayer = i > 0 ? this.game[i - 1][j] : null;
      const southPlayer = i < this.game.length - 1 ? this.game[i + 1][j] : null;

      callback(westPlayer, eastPlayer, northPlayer, southPlayer, player, prop);
    },
    addStrat() {
      if (this.strategy != "") {
        this.strategies.push(this.strategy.toUpperCase());
      }
    },
    assignColours(colours) {
      colours.forEach((current, index) => {
        if (index < this.strategies.length) {
          current.letter = this.strategies[index];
        }
      });
    },
    playerStat(leftP, rightP, aboveP, belowP, middleP, prop) {
      //middleP.payOff = 0;
      this.playOffValues.forEach((state) => {
        if (leftP) {
          if (state.outcome == middleP[prop] + leftP[prop]) {
            middleP.payOff += state.value;
          }
        }
        if (rightP) {
          if (state.outcome == middleP[prop] + rightP[prop]) {
            middleP.payOff += state.value;
          }
        }
        if (aboveP) {
          if (state.outcome == middleP[prop] + aboveP[prop]) {
            middleP.payOff += state.value;
          }
        }
        if (belowP) {
          if (state.outcome == middleP[prop] + belowP[prop]) {
            middleP.payOff += state.value;
          }
        }
      });
    },
  },
};
</script>
