<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import DatePickerSingle from './CalendarSingle.vue'
import DefaultConf from './defaultConf.json'
import type {
  ConfigInterface,
  DatePickerInterface,
  DateRangePickerInterface
} from './interfaces'
// Props from parent component
const props = defineProps<DatePickerInterface>()
const emit = defineEmits(['update:value'])

// Injection
const dateConfig = (inject('akDatepickerConf') || props.config || DefaultConf) as ConfigInterface

// Initialize local properties
const isShowDate: Ref<boolean> = ref(false)
const selectedDateFirst: Ref<string> = ref('')
const selectedDateSecond: Ref<string> = ref('')

// Computed properties
const dateString = computed(() => {
  let dateInString: string
  let dateInObject: { start: string; finish: string } = {
    start: '',
    finish: ''
  }
  if (dateConfig.range) {
    dateInString = `${selectedDateFirst.value}|${selectedDateSecond.value}`
    if (selectedDateFirst.value != '' && selectedDateSecond.value != '') {
      dateInObject = {
        start: selectedDateFirst.value,
        finish: selectedDateSecond.value
      }
      emit('update:value', dateInObject)
      isShowDate.value = false
    }
  } else {
    dateInString = selectedDateFirst.value
    if (selectedDateFirst.value != '') {
      isShowDate.value = false
    }
  }
  emit('update:value', dateInString)
  return dateInString
})

const dateRange = computed(() => {
  const ranges: DateRangePickerInterface = {
    first: {
      start: { day: '', month: '', year: '' },
      finish: { day: '', month: '', year: '' }
    },
    second: {
      start: { day: '', month: '', year: '' },
      finish: { day: '', month: '', year: '' }
    }
  }
  const minConfig: string[] = dateConfig.minDate.split('-')
  const maxConfig: string[] = dateConfig.maxDate.split('-')
  ranges.first.start = {
    day: minConfig[2],
    month: minConfig[1],
    year: minConfig[0]
  }
  ranges.second.finish = {
    day: maxConfig[2],
    month: maxConfig[1],
    year: maxConfig[0]
  }
  if (selectedDateFirst.value != '') {
    const selected: string[] = selectedDateFirst.value.split('-')
    ranges.second.start = {
      day: selected[2],
      month: selected[1],
      year: selected[0]
    }
  } else {
    ranges.second.finish = {
      day: minConfig[2],
      month: minConfig[1],
      year: minConfig[0]
    }
  }
  if (selectedDateSecond.value != '') {
    const selected: string[] = selectedDateSecond.value.split('-')
    ranges.first.finish = {
      day: selected[2],
      month: selected[1],
      year: selected[0]
    }
  } else {
    ranges.first.finish = {
      day: maxConfig[2],
      month: maxConfig[1],
      year: maxConfig[0]
    }
  }

  return ranges
})
// On mounted hook
onMounted(() => {
  isShowDate.value = false
})
</script>

<template>
  <main
    class="ak_datepicker ak-h-full ak-w-full">
    <div class="ak-relative ak-h-full ak-w-full">
    </div>
    <input type="text" v-model="dateString" @focus="isShowDate = true" />
    <br />
    <br />
    <div
      v-if="isShowDate"
      class="ak-absolute ak-max-h-min ak-min-h-112 ak-min-w-6 ak-max-w-min ak-rounded-lg ak-bg-[var(--bg-main)] ak-p-6 ak-text-white"
    >
      <p class="ak-mx-auto ak-block ak-h-3 ak-max-w-max ak-font-semibold ak-text-[color:var(--main-color)]">
        {{ selectedDateFirst }} _ {{ selectedDateSecond }}
      </p>
      <br />
      <div class="ak-flex ak-flex-row ak-gap-1">
        <DatePickerSingle
          name="startDate"
          v-model:date="selectedDateFirst"
          :dateType="dateConfig.dateType"
          :minDate="dateRange.first.start"
          :maxDate="dateRange.first.finish"
          :isStartDatePicker="true"
        />
        <br />
        <DatePickerSingle
          name="finishDate"
          v-if="dateConfig.range"
          v-model:date="selectedDateSecond"
          :dateType="dateConfig.dateType"
          :minDate="dateRange.second.start"
          :maxDate="dateRange.second.finish"
          :isStartDatePicker="false"
        />
      </div>
    </div>
  </main>
</template>

<style lang="scss">
@import "../assets/scss/style";
</style>