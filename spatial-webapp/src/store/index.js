import { createStore } from 'vuex'

export default createStore({
  state: {
    players: [],
    strategies: ["C", "D"],
    colours: [
      { colour: ["bg-indigo-700","bg-red-700"], letter: "" },
      { colour: ["bg-yellow-700","bg-teal-700"], letter: "" },
      { colour: ["bg-green-700","bg-indigo-700"], letter: "" },
      { colour: ["bg-blue-700","bg-rose-700"], letter: "" },
      { colour: ["bg-purple-700","bg-red-700"], letter: "" },
      { colour: ["bg-pink-700","bg-grey-700"], letter: "" }
    ],
    gameStates: []
  },
  getters: {
    numOfstats: state => {
      let statOject = { titles: [], length: [] };
      for (let i = 0; i < state.strategies.length; i++) {
        statOject.titles.push(state.strategies[i]);
        statOject.length.push(state.players.filter(current => current.strategy == state.strategies[i]).length)
      }
      return statOject
    },
    numOfplayers: state => {
      let playerObject = { generation: [], series: [] }
      for (let j = 0; j < state.strategies.length; j++) {
        playerObject.series.push({ name: state.strategies[j], data: [] });
      }
      for (let i = 0; i < state.gameStates.length; i++) {

        playerObject.generation.push(i);

        playerObject.series.forEach( xaxisData => {
          const percentage = (((state.gameStates[i].filter(player => player.strategy == xaxisData.name).length) / (state.players.length)) * 100);
          xaxisData.data.push(percentage.toFixed(2));
        })

      }
      return playerObject;
    }
  },
  mutations: {

  },
  actions: {

  },
  modules: {
  }
})
