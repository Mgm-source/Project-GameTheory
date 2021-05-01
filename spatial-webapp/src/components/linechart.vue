<template>
  <div>
    <apexchart width="550" :options="chartOptions" :series="series">
    </apexchart>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "linechart",
  computed: {
    ...mapGetters(["numOfplayers"]),
    chartOptions: function () {
      const { generation } = this.numOfplayers;
      return {
        chart: {
          height: '100%',
          width: 600,
          type: "line",
        },
        colors: [
          "#4338CA",
          "#B45309",
          "#047857",
          "#1D4ED8",
          "#7C3AED",
          "#6D28D9",
          "#BE185D",
        ],
        dataLabels: { enabled: true },
        xaxis: {
          labels: {
            show: true,
          },
          categories: generation,
          title: {
            text: "Generation",
          },
        },
        yaxis: {
          min  : 0,
          labels: {
            formatter: function (val) {
              return val + "%";
            },
          },
        },
        tooltip: {
          enabled: false,
        },
      };
    },
    series: function () {
      const { series } = this.numOfplayers;
      return series;
    },
  },
};
</script>

<style>
</style>