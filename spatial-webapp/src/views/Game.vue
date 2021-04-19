<template>
  <div class="relative">
    <div class="grid grid-cols-2 gap-4">
    <div class="m-1 rounded-md shadow-sm">
      <label for="inputStrategy" class="block text-sm font-medium text-gray-700">Add more strategies?
      <input id="inputStrategy" type="text" name="stats" class="focus:ring-indigo-500 focus:border-indigo-500 block  pl-7 pr-1 sm:text-lg border-gray-300 rounded-md" maxlength="1" v-model="strategy" placeholder="Enter a letter"/>
      </label>
      <button class="items-center spx-4 font-bold text-white bg-indigo-600 rounded-r-lg hover:bg-indigo-500 focus:bg-indigo-700" @click="addStrat">Add</button>
        <div id="strategies" class="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md">
          Strategies:
          <div v-for="(strategy, index) in statPermutations" :key="index" class="p-4 mb-3 flex justify-between items-center bg-white shadow rounded-lg">
            {{ strategy.outcome }}
            <div>
              value:
              <input type="number" v-model.number="statPermutations[index].value">
            </div>
          </div>
          <select class="bg-yellow-500 py-2 px-4 text-white font-semibold rounded-lg" v-model="defS" @change="reload" v-if="game == false">
            <option selected>Choose a strategy</option>
            <option v-for="(option, index) in strategies" :key="index" :value="option">{{option}}</option>
            
            </select>
        </div>
    </div>
        <div class="m-1 rounded-md shadow-sm">
      
      <chart :length="players.length"></chart>
    </div>
    </div>
    <div class="m-1 rounded-md shadow-sm" v-if="gamestart">
    <button class="bg-yellow-500 py-2 px-4 text-white font-semibold rounded-lg" @click="simulation">Start</button>
    <button class="bg-yellow-500 py-2 px-4 text-white font-semibold rounded-lg" @click="checkPlayOff">pause and play</button>
    <button class="bg-yellow-500 py-2 px-4 text-white font-semibold rounded-lg" @click="stop">stop game</button>
    </div> 

    <spatial :players="players" @select-pos="currentPlayer" :game="game" v-if="gamestart">
    </spatial>
  </div>
</template>

<script>
import Spatial from "@/components/spatial";
import { mapState, mapGetters } from "vuex";
import chart from '../components/chart.vue';
// @ is an alias to /src

export default {
  name: "Game",
  components: {
    Spatial,
    chart,
  },
  data() {
    return {
      game: [],
      size: 50,
      gamestart: false,
      strategy: "",
      playOffValues: [],
      tick: 0,
      count: 0,
      loopID: null,
      play : true,
      defS : "Choose a strategy"
    };
  },
  computed: {
    statPermutations() {
      const outcomes = this.strategies.map((current, i, array) => {
          let perm = [];
          for (let index = 0; index < this.strategies.length; index++) {
            const denomation = current + array[index];
            perm.push({ outcome: denomation, value: 0 });
          }
        return perm;
        }).flat();

        if(outcomes.length == 4){
          outcomes.forEach( face => {
            if(face.outcome == "CC"){
              face.value = 3;
            }
            if(face.outcome == "DC"){
              face.value = 1;
            }
            if(face.outcome == "DD"){
              face.value = 5;
            }
          })
        }
      return outcomes;
    },
    ...mapState(["colours", "gameStates","strategies","players"]
    ),
    ...mapGetters(['numOfstats']),
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
          // player.strategy = this.strategies[Math.round(Math.random() * (this.strategies.length - 1))];
          player.strategy = this.strategies[this.strategies.indexOf(this.defS)];

          this.players.push(player);
        })
      );
      this.assignColours(this.colours);
    },
    checkPlayOff() {
      //const neighbours = [[0, 1],[1, 0],[0, -1],[-1, 0]];
      this.game.forEach((matrix, i) => {
        matrix.forEach((player, j) => {
          this.checkneighbours(  i,  j, player,"payOff", ( neighbours , middleP, prop) => {

            const highest = Math.max(...neighbours.map( neighbour => neighbour.payOff));

            //console.log(highest);

             const better = neighbours.filter( (neighbour)=> {
               
               if(neighbour[prop] > middleP[prop]){
                
                return true;
              }
            });

            let breaker = [];

             for(let i=0; i< better.length; i++){

               if(better[i][prop] == highest){
                 breaker.push(better[i]);
               }
             }

              if(breaker.length == 1){
                if(middleP.strategy != breaker[0].strategy){
                  middleP.strategy = breaker[0].strategy;
                }
                
              }

              if(breaker.length > 1){
      
                // if(breaker.every(curr=>curr.strategy == middleP.strategy)){
                //   console.log( middleP,breaker, "Same");
                // }

                if(breaker.every(curr=>curr.strategy != middleP.strategy)){
                  middleP.strategy = breaker[0].strategy;
                  //console.log( middleP,breaker, "Different");
                }
              }
            
            //console.log(middleP,better,breaker);
            }
            
          );
        });
      });
    },
    currentPlayer(p) {
      let index = this.strategies.indexOf(p.strategy);
      p.strategy = this.strategies[++index % this.strategies.length];
      this.checkStrategy();
    },
    checkStrategy() {
      this.game.forEach((matrix, i) => {
        matrix.forEach((player, j) => {
          this.checkneighbours(i,j,player,"strategy",
            (neighbours, middleP, prop) => {
              middleP.payOff = 0;

              this.playOffValues.forEach( (state) => {

                  neighbours.forEach((neighbour) => {

                      if(state.outcome == middleP[prop] + neighbour[prop]) {
                        middleP.payOff += state.value;
                    }
                  });
                });
            });
        });
      });
    },
    checkneighbours(i, j, player, prop, callback) {

      let neighbours = [];

      const westPlayer = j > 0 ? this.game[i][j - 1] : null;
      const eastPlayer = j < this.game.length - 1 ? this.game[i][j + 1] : null;
      const northPlayer = i > 0 ? this.game[i - 1][j] : null;
      const southPlayer = i < this.game.length - 1 ? this.game[i + 1][j] : null;
      
      neighbours.push(westPlayer);
      neighbours.push(eastPlayer)
      neighbours.push(northPlayer)
      neighbours.push(southPlayer);

      callback(neighbours.filter( neighbour => neighbour != null), player, prop);
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
        this.copyGameState();
        this.checkPlayOff();
        this.checkStrategy();
        
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
    copyGameState(){
      let array = [];
      this.players.forEach( p=>{
        array.push(Object.assign({}, p))
      });
    this.gameStates.push(array);
    },
    reload(){
      if(this.defS != "Choose a strategy"){
        this.initGame();
        this.checkStrategy();
      }

    }
  },
};
</script>
