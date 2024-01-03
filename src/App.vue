<script setup lang="ts">
import { DatePicker } from './components'
import { ref } from 'vue'

const date = ref('')
</script>

<template>
  <div class="w-8 h-8 ak-bg-red-600"></div>
  <DatePicker v-model:value="date" />
</template>

