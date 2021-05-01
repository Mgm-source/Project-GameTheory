<template>
  <div>
    <apexchart width="550" :options="chartOptions" :series="series">
    </apexchart>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "piechart",
  computed: {
    ...mapGetters(["numOfstats"]),
    chartOptions: function () {
      const { titles } = this.numOfstats;
      return {
        chart: {
          height: 350,
          type: "pie",
        },
        colors: ['#4338CA','#B45309','#047857','#1D4ED8', '#7C3AED', '#6D28D9','#BE185D'],
        labels: titles,
        tooltip: {
          enabled: false,
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: false,
                name: {
                  show: false,
                },
                total: {
                  show: true,
                },
              },
            },
          },
        },
      };
    },
    series: function () {
      const { length } = this.numOfstats;
      return length;
    },
  },
};
</script>

<style>
</style>