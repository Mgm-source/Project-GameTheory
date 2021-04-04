<template>
  <div :class="[active,'h-12 rounded-md flex items-center justify-center text-white text-2xl font-extrabold hover:bg-red-700']" @click="playerStatus">
    <i>{{player.strategy}} : {{player.payOff}}</i>
  </div>
</template>

<script>
export default {
  name: "MatrixCell",
  props: {
    player: { type: Object, required: true },
  },
  data() {
    return { interactive: false };
  },
  computed: {
    active() {
      return this.interactive ? "bg-red-700" : this.stratColour();
    },
    // col() {return `board-cell-col-${this.player.id % this.size}`}
    // row() {return `board-cell-row-${Math.floor(this.player.id / this.size)}`},
  },
  methods: {
    playerStatus(event) {
      this.interactive = !this.interactive;
      this.$emit("select-cell", event, this.player);
    },
    stratColour() {
      const delta = this.player.strategy.charCodeAt() % this.colours.length;
      return this.colours.reduce((accu, curr, index) => {
        if (delta == index) {
          accu = curr;
        }
        return accu;
      });
    },
  },
  setup() {
    const colours = [
      "bg-gray-700",
      "bg-indigo-700",
      "bg-yellow-700",
      "bg-green-700",
      "bg-blue-700",
      "bg-purple-700",
      "bg-pink-700",
    ];
    return { colours };
  },
};
</script>

<style>
</style>