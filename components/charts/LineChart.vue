<template>
  <div class="mt-6">
    <Line :data="chartData" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs";

const props = defineProps<{
  schedule: { date: string; remaining: number }[];
}>();

const chartData = {
  labels: props.schedule.map((s) => s.date),
  datasets: [
    {
      label: "หนี้คงเหลือ",
      data: props.schedule.map((s) => s.remaining),
      borderColor: "#10B981",
      fill: false,
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    y: {
      ticks: { callback: (v: number) => v.toLocaleString("th-TH") },
    },
  },
};
</script>
