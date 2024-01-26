<script setup lang="ts">
import Translation from '../../../assets/translation.json'
import { computed, onMounted, type Ref, ref } from 'vue'
import type { StepType, StepsPropsInterface } from '../interfaces'

// Props from parent component
const props = defineProps<StepsPropsInterface>()
/**
 *  Emits: Only for date changes
 *  ```ts
 *    emit('update:date', dateString.value)
 *  ```
 */
const emit = defineEmits(['update:step'])

// Initialize local properties
const translation = ref(
  Translation as Record<
    string,
    { months: string[]; days: string[]; status: Record<StepType, string> }
  >
)
const selectedStep = computed(() => {
  return props.step || 'year'
})
</script>
<template>
  <main
    class="ak-mx-auto ak-mb-3 ak-flex ak-min-w-min ak-flex-row ak-justify-between ak-items-center ak-gap-0.5 ak-rounded ak-bg-[--select-trigger-bg] ak-p-1"
  >
    <button
      v-for="(status, key, index) in translation[dateType].status"
      :class="{
          'ak-bg-[var(--primary-color)]': selectedStep == key.toString(),
          'ak-w-1/4 ak-py-0.5 ak-px-1 ak-rounded': true,
        }"
      :key="`statusTrigger-${index}`"
      @click="emit('update:step', key)"
    >
      {{ status.charAt(0).toUpperCase() + status.slice(1) }}
    </button>
  </main>
</template>
