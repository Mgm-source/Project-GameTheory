<template>
  <div class="spatial-board gap-2" :style="dynamicGrid">
    <template v-for="p in players" :key="p.id">
      <board-cell
        :player="p"
        @select-cell="selectPlayer"
      ></board-cell>
    </template>
  </div>
</template>

<script>
import BoardCell from "./BoardCell.vue";
export default {
  name: "SpatialGame",
  props: {
    players: { type: Array, required: true },
    game: { type: Array, required: true },
  },
  computed: { },
  data() {
    return {};
  },
  components: {
    BoardCell,
  },
  methods: {
    selectPlayer(event, player) {
      console.log(event, player);
      if (this.interactive) {
        this.$emit("select-pos", player);
      }
    },
  },
  setup(props) {
    const dynamicGrid = {
      "grid-template-columns": `repeat(${props.game.length} ,1fr)`,
      "grid-template-rows": `repeat(${props.game.length} ,1fr)`,
    };
    return { dynamicGrid };
  },
};
</script>
<style>
.spatial-board {
  display: grid;
}
</style>