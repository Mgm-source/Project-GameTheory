<template>
  <div class="relative h-screen">
    <div class="grid grid-cols-4 gap-3">
      <div class="m-1 rounded-md shadow-sm text-2xl">
        <div class="flex">
        <label for="inputStrategy" class="block font-medium text-gray-700">Add more strategies?</label>
        <input id="inputStrategy" type="text" name="stats" class="focus:ring-indigo-500 focus:border-indigo-500 block  pl-7 pr-1 border-gray-300 rounded-md" maxlength="1" v-model="strategy" placeholder="Enter a letter"/>
        <button class="font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:bg-indigo-700" @click="addStrat">Add</button>
        </div>
          <div class="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 rounded-md">
          <div class="">
            <span class="text-gray-700">Strategies:</span>
            <div v-for="(strategy, index) in statPermutations" :key="index" class="p-4 mb-3 flex justify-between items-center bg-white shadow rounded-lg text-3xl">{{ strategy.outcome }}
              <label :for="'strategy'+index" class="relative">value:
                <input :id="'strategy'+index" type="number" v-model.number="strategy.value">
              </label>
            </div>
          </div>
          <!-- <div class="">
            <span class="text-gray-700">Probabilities:</span>
          <div v-for="(prob, index) in reactiveStrat" :key="index" class="p-4 mb-3 flex justify-between items-center bg-white shadow rounded-lg text-3xl">{{ prob.strategy }}
              <label :for="'proba'+index" class="relative">value:
                <input :id="'proba'+index" type="number" max="1" min="0" step="0.1" v-model.number="prob.probability">
              </label>
            </div>
          </div> -->
          <div v-if="game == false" class="flex text-white font-semibold">
            <div class="bg-yellow-500 py-2 px-4 rounded-lg">
              <span>Neighborhood type</span>
              <div class="mt-2">
                <label class="inline-flex items-center">
                  <input type="radio" class="form-radio" v-model.number="moore" value="1">
                  <span class="ml-2">Moore</span>
                </label>
                <label class="inline-flex items-center ml-6">
                  <input type="radio" class="form-radio" v-model.number="moore" value="0">
                  <span class="ml-2">Von Neumann</span>
                </label>
              </div>
            </div>
            <select class="bg-yellow-500 py-2 px-4 rounded-lg m-1" v-model="defS" @change="reload">
              <option selected>Choose a strategy</option>
              <option v-for="(option, index) in strategies" :key="index" :value="option">{{option}}</option>
            </select>
          </div>
          </div>
    </div>

    <div class="m-1 rounded-md shadow-sm flex">
      <piechart :ready="gamestart"></piechart>
      <linechart :ready="gamestart"></linechart>
    </div>

    </div>
    <div class="m-1 rounded-md shadow-sm" v-if="gamestart">
      <button class="bg-green-500 py-2 px-4 text-white font-semibold block-lg" v-if="!count" @click="simulation">Start</button>
      <button class="bg-blue-500 py-2 px-4 text-white font-semibold block-lg" @click="pause">pause</button>
      <button class="bg-red-500 py-2 px-4 text-white font-semibold block-lg" @click="stop">stop game</button>
      <button class="bg-red-700 py-2 px-4 text-white font-semibold block-lg" @click="restart">restart game</button>
      <button class="bg-yellow-500 py-2 px-4 text-white font-semibold block-lg" >Step : {{count}}</button>
      <button class="bg-pink-500 py-2 px-4 text-white font-semibold block-lg" v-if="this.strategies.length == 2 && !count" @click="toggleTat">Tit for tat : {{titgame}}</button>

    </div> 
    <spatial :players="players" @select-pos="currentPlayer" :game="game" v-if="gamestart"></spatial>
  </div>
</template>

<script>
const chance = require('chance').Chance();
import Spatial from "@/components/spatial";
import { mapState } from "vuex";
import piechart from '../components/piechart.vue';
import Linechart from '../components/linechart.vue';
// @ is an alias to /src

export default {
  name: "Game",
  components: {
    Spatial,
    piechart,
    Linechart,
  },
  data() {
    return {
      game: [],
      size: { y : 20 , x : 20},
      gamestart: false,
      strategy: "",
      tick: 0,
      count: 0,
      loopID: null,
      play : false,
      defS : "Choose a strategy",
      moore : 1,
      reactiveValues : [],
      oldStrat : [],
      titgame: false
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
              face.value = 1;
            }
            if(face.outcome == "DC"){
              face.value = 1.65;
            }
            if(face.outcome == "DD"){
              face.value = 0;
            }
            if(face.outcome == "CD"){
              face.value = 0;
            }
          })
        }
      return outcomes;
    },
    reactiveStrat(){
      const stochastic = this.strategies.map( (current) => { return { strategy : current , probability : 0 }})
      stochastic[0].probability = 1;
      return stochastic;
    },
    splitArray(){ 
      let object = { items : [], chance : []};
      this.reactiveValues.forEach( value => {
        object.items.push( value.strategy)
        object.chance.push(value.probability)
      })
      return object;
    },
    ...mapState(["colours", "gameStates","strategies","players"]),
  },
  methods: {
    createMatrix(size) {
      let gameMatrix = [];
      let count = 0;
      for (let i = 0; i < size.x; i++) {
        let row = [];
        for (let j = 0; j < size.y; j++) {
          row.push({ strategy: "", payOff: 0, id: count++, state : 0 });
        }
        gameMatrix.push(row);
      }
      return gameMatrix;
    },
    initGame() {
      this.gamestart = true;
      this.game = this.createMatrix(this.size);
      this.reactiveValues = this.reactiveStrat;

      this.game.forEach((matrix) =>
        matrix.forEach((player) => {
          // player.strategy = this.strategies[Math.round(Math.random() * (this.strategies.length - 1))];
          // use the 2d array because it easier to understand.
          player.strategy = this.strategies[this.strategies.indexOf(this.defS)];

          // its more efficent to work with a 1d array;  
          this.players.push(player);
        })
      );
      this.assignColours(this.colours);
    },
    checkPlayOff() {
      let prev = [];
      this.players.forEach((player, i , array) => {

          this.checkneighbours(i, array, "payOff", (neighbours,prop) => {

            let breaker = [];
            // let diffStrategies = {};
            //const rand = Math.random();

            const highest = Math.max(...neighbours.map( neighbour => neighbour.payOff));

            neighbours.filter( neighbour => neighbour[prop] > player[prop]).forEach( neighbour => {

              if(neighbour[prop] == highest){
                breaker.push(neighbour);
                // diffStrategies[neighbour.strategy] = (diffStrategies[neighbour.strategy] || 0) + 1; 
              }
            });

              const strategies = breaker.map( neighbour => neighbour.strategy);
              const cantChoose = new Set(strategies).size !== 1;

             
              if(breaker.length == 1){

                if(player.strategy != breaker[0].strategy){
                  player.strategy = breaker[0].strategy;
                }
              }
              // let prob = [];
              // for (const [key, value] of Object.entries(diffStrategies)){
              //   prob.push( { strategy :  key , probability : value/strategies.length });
              // }

              if(breaker.length > 1){
      
                // if(breaker.every(curr=>curr.strategy == player.strategy)){
                //   console.log( player,breaker, "Same");
                // } 

                // player.strategy = prob.reduce( (prev,curr) => prev.probability < curr.probability ? curr : prev).strategy;

                 //console.log( player,breaker, "Opposite");

                if(cantChoose){

                  player.strategy = breaker[chance.integer({ min : 0, max : breaker.length-1})];
                
                }

                if(breaker.every(curr=>curr.strategy != player.strategy)){
                  player.strategy = breaker[0].strategy;
                }

              }
              prev.push(player.strategy);
            }
            
          );
        });
        this.oldStrat.push(prev);
    },
    currentPlayer(p) {
      if(!this.play){
      let index = this.strategies.indexOf(p.strategy);
      p.strategy = this.strategies[++index % this.strategies.length];
      }
    },
    toggleTat(){
      this.titgame = !this.titgame;  
    },
    checkStrategy() {
      
      this.players.forEach( (player, i , array) => {
        player.payOff = 0;
          this.checkneighbours(i, array,"strategy", (neighbours,prop) => {
              this.statPermutations.forEach( state =>{
                neighbours.forEach((neighbour) => {
                  if( state.outcome === player[prop].concat(neighbour[prop]) ) {
                    player.payOff += state.value;
                  }
                  });
                });
        });
      });
    },
    checkneighbours(i, array ,prop, callback){

      let neighbours = [];

      const westPlayer = i > 0  && i % this.size.x !== 0 ? array[i - 1] : null;
      const eastPlayer = i < this.players.length && (i+1) % this.size.x !== 0 ? array[i + 1] : null;
      const northPlayer = i >= this.size.x ? array[i - this.size.x] : null;
      const southPlayer = i < this.players.length - this.size.x ? array[i + this.size.x] : null;

      neighbours.push(westPlayer,eastPlayer,northPlayer,southPlayer);

      if(this.moore == true){
        
        const nEastPlayer = i >= this.size.x && (i+1) % this.size.x ? array[i+1 - this.size.x] : null;
        const nWestPlayer = i >= this.size.x && i % this.size.x ? array[i-1 - this.size.x] : null;
        const sEastPlayer =  i < this.players.length - this.size.x && (i+1) % this.size.x !== 0? array[i+1 + this.size.x] : null;
        const sWestPlayer = i < this.players.length - this.size.x && i % this.size.x !== 0? array[i-1 + this.size.x] : null;

        neighbours.push(nWestPlayer,nEastPlayer,sWestPlayer,sEastPlayer);
      }

      callback(neighbours.filter( neighbour => neighbour != null), prop);

    },
    compareState(){
      if(this.count > 0){
      this.players.forEach( (player, i) => {
        player.state = 0;
        if(player.strategy !== this.gameStates[this.gameStates.length-2][i].strategy){
          player.state = 1;
        }
      })
      }
    },
    titfortat(){
      if(this.count > 0){
        this.players.forEach( (player, i) => {
        if(this.oldStrat[this.oldStrat.length-2][i] === "D"){
          player.strategy = "D"
        }else{
          player.strategy = "C";
        }
      })
      }
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
      if(this.tick % 35 == 0){
        this.pushState();
        this.compareState();
        this.checkPlayOff();
        if(this.titgame){
          console.log(1);
          this.titfortat();
        }
        this.checkStrategy();
        this.count++;
      } 
    },
    stop() {
      cancelAnimationFrame(this.loopID);
    },
    pause(event) {
    this.checkStrategy();
     this.play = !this.play;
     event.target.innerText = this.play ? "pause":"play";
    },
    simulation() {

      if(this.tick == 0){
        this.play = true;
        this.checkStrategy();
      }

      if(this.play)
      {
        this.tick++
        this.loop();
      }
      
     this.loopID = requestAnimationFrame(this.simulation);

    },
    pushState(){
    this.gameStates.push(this.players.map(player => Object.freeze(Object.assign({},player))));
    },
    reload(){
      if(this.defS != "Choose a strategy"){
        this.initGame();
      }

    },
    restart(){
      cancelAnimationFrame(this.loopID);
      this.defS = "Choose a strategy";
      this.gamestart = false;
      this.game = [];
      this.count = 0;
      this.tick = 0;
      this.play = false;

      function deleteArray(array) {
        
        for(let i =0 ; i < array.length; i++){
          array.pop();
        }
        
        if(array.length !== 0){

          deleteArray(array);

        }
      }
      deleteArray(this.gameStates);
      deleteArray(this.players);
    },
  },
};
</script>
