<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">เปรียบเทียบสินเชื่อ</h1>

    <div class="grid gap-4 md:grid-cols-2">
      <LoanForm
        v-for="(form, index) in forms"
        :key="index"
        v-model="forms[index]"
        :hide="true"
        @submit="calculateAll"
      />
    </div>

    <div v-if="summaries.some((s) => s)" class="overflow-x-auto mt-8">
      <table class="w-full border rounded shadow">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-2 text-left">รายการ</th>
            <th
              v-for="(summary, index) in summaries"
              :key="index"
              class="px-4 py-2 text-center"
            >
              สินเชื่อ {{ index + 1 }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="field in fields" :key="field.key">
            <td class="px-4 py-2 font-medium">{{ field.label }}</td>
            <td
              v-for="(summary, i) in summaries"
              :key="i"
              class="px-4 py-2 text-center"
              :class="highlight(field.key, summary[field.key])"
            >
              {{ format(summary[field.key]) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLoanCalculator } from "~/composables/useLoanCalculator";
import type { LoanSummary, LoanInput } from "~/types/loan";

const forms = reactive<LoanInput[]>([
  {
    amount: 500000,
    interestRate: 5,
    years: 5,
    months: 0,
    startDate: new Date().toISOString().substring(0, 10),
  },
  {
    amount: 500000,
    interestRate: 4.5,
    years: 5,
    months: 0,
    startDate: new Date().toISOString().substring(0, 10),
  },
]);

const summaries = reactive<(LoanSummary | null)[]>([null, null]);

const fields = [
  { key: "monthlyPayment", label: "ยอดผ่อนรายเดือน" },
  { key: "totalInterest", label: "ดอกเบี้ยรวม" },
  { key: "totalPayment", label: "ยอดชำระทั้งหมด" },
];

function calculateAll() {
  summaries.length = 0;
  forms.forEach((form: LoanInput, index: number) => {
    const result = useLoanCalculator(form);
    summaries[index] = {
      ...result.summary,
      amount: form.amount,
    };
  });
}

function format(n: number) {
  return new Intl.NumberFormat("th-TH").format(n);
}

function highlight(key: keyof LoanSummary, value: number) {
  const all = summaries
    .filter(Boolean)
    .map((s: LoanSummary) => s?.[key]) as number[];
  if (all.length < 2) return "";
  const min = Math.min(...all);
  return value === min ? "bg-green-100 dark:bg-green-800" : "";
}
</script>
