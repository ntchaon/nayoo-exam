<template>
  <LoanForm @submit="calculate" />

  <div v-if="summary" class="mt-6"><LoanSummary :summary="summary" /></div>
  <div v-if="schedule.length" class="mt-6"><LoanTable :items="schedule" /></div>
  <template v-if="summary">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <BaseCard>
        <h2 class="text-lg font-semibold mb-2">สัดส่วนเงินต้น - ดอกเบี้ย</h2>
        <ChartsPieChart
          :principal="summary.amount"
          :interest="summary.totalInterest"
        />
      </BaseCard>
      <BaseCard>
        <h2 class="text-lg font-semibold mb-2">กราฟหนี้คงเหลือรายเดือน</h2>
        <ChartsLineChart :schedule="schedule" />
      </BaseCard>
      <BaseCard>
        <h2 class="text-lg font-semibold mb-2">ดอกเบี้ยสะสมรายปี</h2>
        <ChartsBarChart :schedule="schedule" />
      </BaseCard>
    </div>
  </template>
</template>

<script setup lang="ts">
import { useHead } from "#imports";
useHead({
  title: "คำนวนดอกเบี้ยเงินกู้ | Nayoo Exam",
  meta: [
    {
      name: "description",
      content: "คำนวนดอกเบี้ยเงินกู้",
    },
    {
      name: "keywords",
      content: "คำนวนดอกเบี้ยเงินกู้ | Nayoo Exam",
    },
    {
      property: "og:title",
      content: "เครื่องมือคำนวนดอกเบี้ยเงินกู้ | Nayoo Exam",
    },
    {
      property: "og:description",
      content: "คำนวนดอกเบี้ยเงินกู้",
    },
  ],
});
import { useLoanCalculator } from "~/composables/useLoanCalculator";
import type { LoanInput, LoanSummary, InstallmentRow } from "~/types/loan";

const summary = ref<LoanSummary | null>(null);
const schedule = ref<InstallmentRow[]>([]);

function calculate(input: LoanInput) {
  const result = useLoanCalculator(input);
  summary.value = result.summary;
  schedule.value = result.schedule;
}
</script>
