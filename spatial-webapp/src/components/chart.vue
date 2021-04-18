<template>
  <div>
    Number of players : {{ length }}
    <apexchart width="550" :options="chartOptions" :series="series">
    </apexchart>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "chart",
  props : {
     length : { required : true }

     },

  computed: {
    ...mapGetters(["numOfstats"]),
    ...mapState(["colours", "gameStates", "strategies", "players","colours"]),
    chartOptions() {
      const chartOptions = {
        chart: {
          height: 350,
          type: "pie",
        },
        labels: this.strategies
        ,
        tooltip: {
          enabled: false,
        },
      };
      return chartOptions;
    },
    series() {
      const series = this.numOfstats;
      return series;
    },
  },
};
</script>

<style>
</style>