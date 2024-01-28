<script setup lang="ts">
import { computed, reactive } from 'vue'
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
const steps: StepType[] = reactive(['year', 'month', 'date'])

// Computed
const selectedStep = computed(() => {
  return props.step || 'year'
})
</script>
<template>
  <main
    class="ak-mx-auto ak-flex ak-min-w-min ak-flex-row ak-justify-between ak-items-center \
           ak-gap-[--trigger-gap] ak-rounded-[--trigger-rounded] ak-bg-[--select-trigger-bg] ak-p-1"
  >
    <button
      v-for="(step, index) in steps"
      :class="{
              'ak-bg-[var(--primary-color)] !ak-text-[--trigger-active-text-color]': selectedStep == step.toString(),
              '!ak-text-[--trigger-inactive-text-color]': selectedStep != step.toString(),
              '!ak-px-[--trigger-x-padding] !ak-py-[--trigger-y-padding] ak-rounded-[--trigger-btn-rounded]': true,
            }"
      style="font-size: var(--trigger-font-size)"
      :key="`statusTrigger-${index}`"
      @click="emit('update:step', step)"
    >
      {{ props.messages.status[step] }}
    </button>
  </main>
</template>
