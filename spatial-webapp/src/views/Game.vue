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
          <input type="number" v-model.number="statPermutations[index].value">
          </div>
        </ul>
    </div>
      <div id="stats" class="m-1 relative rounded-md shadow-sm w-1/4">
      <label for="strats" class="block text-sm font-medium text-gray-700">Number of players</label>
      <div id="strats" name="stats" class="focus:ring-indigo-500 focus:border-indigo-500 block  pl-7 pr-1 sm:text-lg border-gray-300 rounded-md">
        <i>{{numOfplayers}}  {{numOfstats}}</i>
      </div>
    </div>
    <h1>This is where the spatial game information graph and stats goes <span>{{count}}</span></h1> 
    <button class="bg-yellow-500 py-2 px-4 bg-light-blue-500 text-white font-semibold rounded-lg" @click="initGame">
    Start
    </button>
        <button class="bg-yellow-500 py-2 px-4 bg-light-blue-500 text-white font-semibold rounded-lg" @click="pause">
    pause and play
    </button>

            <button class="bg-yellow-500 py-2 px-4 bg-light-blue-500 text-white font-semibold rounded-lg" @click="stop">
    stop game
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
      tick: 0,
      count: 0,
      loopID: null,
      play : true
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
    ...mapState(["colours", "gameStates"]
    ),
    numOfplayers(){ return this.players.length
    },
    numOfstats(){
      let statslength = []
      for( let i=0; i < this.strategies.length; i++){
        statslength.push( { stat : this.strategies[i], size : this.players.filter( current => current.strategy == this.strategies[i]).length })
      }
      return statslength
    }
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
            Math.round(Math.random() * (this.strategies.length - 1))
          ];
          this.players.push(player);
        })
      );
      this.assignColours(this.colours);
      console.log(this.playOffValues);
      this.simulation();
    },
    checkPlayOff() {
      //const neighbours = [[0, 1],[1, 0],[0, -1],[-1, 0]];
      this.game.forEach((matrix, i) => {
        matrix.forEach((player, j) => {
          this.checkneighbours(
            i,
            j,
            player,
            "payOff",
            (leftP, rightP, aboveP, belowP, middleP, prop) => {
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
            }
          );
        });
      });
    },
    currentPlayer(p) {
      let index = this.strategies.indexOf(p.strategy);
      p.strategy = this.strategies[++index % this.strategies.length];
    },
    checkStrategy() {
      this.game.forEach((matrix, i) => {
        matrix.forEach((player, j) => {
          this.checkneighbours(i,j,player,"strategy",
            (leftP, rightP, aboveP, belowP, middleP, prop) => {
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
            }
          );
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
    loop() {
      if(this.tick % 30 == 0)
      {
        this.checkStrategy()
        this.checkPlayOff();
        this.count++
      }
      
    },
    stop() {
      cancelAnimationFrame(this.loopID);
      console.log(this.gameStates)
    },
    pause() {
     this.play = !this.play;
    },
    simulation() {

      this.loopID = requestAnimationFrame(this.simulation);

      if(this.play)
      {
        this.tick++
        this.loop();
      }
    },
  },
};
</script>
