<template>
  <div class="max-w-md mx-auto mt-6">
    <Pie :data="data" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { Pie } from "vue-chartjs";

const props = defineProps<{
  principal: number;
  interest: number;
}>();

const data = {
  labels: ["เงินต้น", "ดอกเบี้ย"],
  datasets: [
    {
      data: [props.principal, props.interest],
      backgroundColor: ["#3B82F6", "#F59E0B"],
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: "bottom" },
  },
};
</script>
