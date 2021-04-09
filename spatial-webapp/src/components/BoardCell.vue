<template>
  <div :class="[active,'h-12 rounded-md flex items-center justify-center text-white text-2xl font-extrabold hover:bg-red-700 cursor-pointer']" @click="playerStatus">
    <i>{{player.strategy}} : {{player.payOff}}</i>
  </div>
</template>

<script>
import { mapState } from "vuex";
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
      return  this.stratColour.colour;
    },
    // col() {return `board-cell-col-${this.player.id % this.size}`}
    // row() {return `board-cell-row-${Math.floor(this.player.id / this.size)}`},
    ...mapState([
      'colours'
    ]),
    stratColour() {
      return this.colours.find((element => element.letter == this.player.strategy))
    }
  },
  methods: {
    playerStatus(event) {
      this.interactive = !this.interactive;
      this.$emit("select-cell", event, this.player);
    },
  },
};
</script>

<style>
</style>