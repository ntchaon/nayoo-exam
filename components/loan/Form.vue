<template>
  <form class="grid gap-4 md:grid-cols-2" @submit.prevent="handleSubmit">
    <BaseInput
      v-model="form.amount"
      label="ยอดเงินกู้ (บาท)"
      type="number"
      required
      min="100000"
      max="10000000"
    />

    <BaseInput
      v-model="form.interestRate"
      label="อัตราดอกเบี้ยต่อปี (%)"
      type="number"
      required
      step="0.01"
      min="1"
      max="20"
    />

    <BaseInput
      v-model="form.years"
      label="ระยะเวลากู้ (ปี)"
      type="number"
      required
      min="0"
      max="30"
    />

    <BaseInput
      v-model="form.months"
      label="ระยะเวลากู้ (เดือน)"
      type="number"
      required
      min="0"
      max="11"
    />

    <BaseInput
      v-if="!hide"
      v-model="form.startDate"
      label="วันที่เริ่มต้นสัญญา"
      type="date"
      required
      class="md:col-span-2"
    />
  </form>
</template>

<script setup lang="ts">
import type { LoanInput } from "~/types/loan";

const props = defineProps<{
  modelValue?: LoanInput;
  hide?: Boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: LoanInput): void;
  (e: "submit", value: LoanInput): void;
}>();

const form = reactive<LoanInput>(
  Object.assign(
    {
      amount: 100000,
      interestRate: 5.0,
      years: 5,
      months: 0,
      startDate: new Date().toISOString().substring(0, 10),
    },
    props.modelValue
  )
);

watch(
  form,
  (val: LoanInput) => {
    emit("update:modelValue", val), emit("submit", { ...val });
  },

  {
    deep: true,
  }
);

function handleSubmit() {
  emit("submit", { ...form });
}
</script>
