<script setup lang="ts">
import { DatePicker } from './components'
import { ref } from 'vue'

const date = ref('')
</script>

<template>
<!--  <div class="ak-fixed ak-top-1/2 ak-right-1/2 ak-w-8 ak-h-8 ak-bg-red-600">-->
    <DatePicker v-model:value="date" lang="fa">
      <template #ak-button>hello</template>
    </DatePicker>
<!--  </div>-->
</template>

