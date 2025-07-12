<template>
  <BaseButton @click="downloadExcel" class="mb-6">
    ดาวน์โหลดตาราง Excel
  </BaseButton>
  <div class="overflow-x-auto">
    <table class="min-w-full text-sm text-left border dark:border-gray-700">
      <thead class="bg-gray-100 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-2">งวดที่</th>
          <th class="px-4 py-2">วันที่</th>
          <th class="px-4 py-2">เงินต้น</th>
          <th class="px-4 py-2">ดอกเบี้ย</th>
          <th class="px-4 py-2">ยอดชำระ</th>
          <th class="px-4 py-2">เงินต้นคงเหลือ</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in items"
          :key="i"
          class="border-t dark:border-gray-600"
        >
          <td class="px-4 py-2">{{ row.installment }}</td>
          <td class="px-4 py-2">{{ row.date }}</td>
          <td class="px-4 py-2">{{ format(row.principal) }}</td>
          <td class="px-4 py-2">{{ format(row.interest) }}</td>
          <td class="px-4 py-2">{{ format(row.total) }}</td>
          <td class="px-4 py-2">{{ format(row.remaining) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { InstallmentRow } from "~/types/loan";
const { items } = defineProps<{
  items: InstallmentRow[];
}>();
function format(n: number) {
  return new Intl.NumberFormat("th-TH").format(n);
}
async function downloadExcel() {
  console.log(items);
  const res = await fetch("/api/export-excel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rows: items }),
  });

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "loan_schedule.xlsx";
  link.click();
}
</script>
