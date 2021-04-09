import { createStore } from 'vuex'

export default createStore({
  state: {
    colours: [
      { colour: "bg-gray-700", letter: "" },
      { colour: "bg-indigo-700", letter: "" },
      { colour: "bg-yellow-700", letter: "" },
      { colour: "bg-green-700", letter: "" },
      { colour: "bg-blue-700", letter: "" },
      { colour: "bg-purple-700", letter: "" },
      { colour: "bg-pink-700", letter: "" }
    ],
    gameStates : []
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
