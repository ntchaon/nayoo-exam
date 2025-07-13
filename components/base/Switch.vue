
<template>
  <div class="flex items-center gap-6">
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="radio" :value="true" v-model="model" class="form-radio" />
      <span>ใช้งาน</span>
    </label>
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="radio" :value="false" v-model="model" class="form-radio" />
      <span>ไม่ใช้งาน</span>
    </label>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<boolean>({ required: true });
const props = defineProps<{
  label?: string;
  required?: boolean;
}>();
</script>
