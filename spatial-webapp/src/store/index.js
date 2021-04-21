import { createStore } from 'vuex'

export default createStore({
  state: {
    players: [],
    strategies: ["C", "D"],
    colours: [
      { colour: "bg-indigo-700", letter: "" },
      { colour: "bg-yellow-700", letter: "" },
      { colour: "bg-green-700", letter: "" },
      { colour: "bg-blue-700", letter: "" },
      { colour: "bg-purple-700", letter: "" },
      { colour: "bg-pink-700", letter: "" }
    ],
    gameStates: []
  },
  getters: {
    numOfstats: state => {
      let statslength = []
      for (let i = 0; i < state.strategies.length; i++) {
        statslength.push(state.players.filter(current => current.strategy == state.strategies[i]).length)
      }
      return statslength
    },
  },
  mutations: {

  },
  actions: {
    
  },
  modules: {
  }
})
