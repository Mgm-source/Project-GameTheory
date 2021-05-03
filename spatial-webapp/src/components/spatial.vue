<template>
  <div class="grid gap-1 select-none h-full" :style="dynamicGrid">
      <board-cell v-for="p in players" :key="p.id"
        :player="p"
        @select-cell="selectPlayer"
      ></board-cell>
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
  emits : ["select-pos"],
  components: {
    BoardCell,
  },
  methods: {
    selectPlayer(event, player, bool) {
      this.$emit("select-pos", player, event, bool );
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