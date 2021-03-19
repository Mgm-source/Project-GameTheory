<template>
<div class="spatial-board gap-2" :style="dynamicGrid">
  <template v-for="p in players " :key="p.id">
    <board-cell :player="p" @select-cell="selectPlayer">
    </board-cell>
  </template>
</div>
</template>

<script>
import BoardCell from './BoardCell.vue';
export default {
  name: "SpatialGame",
  props: {
    players : { type : Array, required : true },
    game : { type : Array, required : true } 
  },
  data() {
    return { dynamicGrid : { "grid-template-columns" : `repeat(${this.game.length} ,2fr)`, 
                             "grid-template-rows" : `repeat(${this.game.length} ,2fr)`} 
                            }
  },
  components: {
    BoardCell
  },
  methods : {
    selectPlayer(pos){
      if(this.interactive){
        this.$emit('select-pos',pos)
      }
    }
  }
};
</script>
<style>
.spatial-board {
display: grid;

}
</style>