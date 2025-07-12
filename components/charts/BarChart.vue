<template>
  <div class="mt-6">
    <Bar :data="chartData" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { Bar } from "vue-chartjs";

const props = defineProps<{
  schedule: { date: string; interest: number }[];
}>();

const yearly = groupInterestByYear(props.schedule);

const chartData = {
  labels: Object.keys(yearly),
  datasets: [
    {
      label: "ดอกเบี้ยต่อปี",
      data: Object.values(yearly),
      backgroundColor: "#EF4444",
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
};

function groupInterestByYear(data: typeof props.schedule) {
  const result: Record<string, number> = {};
  data.forEach((s) => {
    const year = new Date(s.date).getFullYear();
    result[year] = (result[year] || 0) + s.interest;
  });
  return result;
}
</script>
