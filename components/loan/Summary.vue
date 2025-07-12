<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-3">
    <div class="flex justify-between">
      <span>ยอดผ่อนรายเดือน</span>
      <strong>{{ formatCurrency(summary.monthlyPayment) }} บาท</strong>
    </div>
    <div class="flex justify-between">
      <span>ดอกเบี้ยรวม</span>
      <strong>{{ formatCurrency(summary.totalInterest) }} บาท</strong>
    </div>
    <div class="flex justify-between">
      <span>ยอดชำระทั้งหมด</span>
      <strong>{{ formatCurrency(summary.totalPayment) }} บาท</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoanSummary } from "~/types/loan";
defineProps<{
  summary: LoanSummary;
}>();

function formatCurrency(value: number) {
  return new Intl.NumberFormat("th-TH").format(value);
}
</script>
