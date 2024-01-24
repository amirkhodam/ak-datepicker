<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import DatePickerSingle from './CalendarSingle.vue'
import DefaultConf from './defaultConf.json'
import type {
  ConfigInterface, DateInterface,
  DatePickerInterface,
  DateRangePickerInterface
} from './interfaces'
import { DateToObject, DateToString } from './date'

// Props from parent component
const props = defineProps<DatePickerInterface>()
const emit = defineEmits(['update:value'])

// Injection
const dateConfig = (inject('akDatepickerConf') || props.config || DefaultConf) as ConfigInterface

// Initialize local properties
const isShowDate: Ref<boolean> = ref(false)
const selectedDateFirst: Ref<DateInterface> = ref({ day: '', month: '', year: '' })
const selectedDateSecond: Ref<DateInterface> = ref({ day: '', month: '', year: '' })

// Computed properties
const dateString = computed(() => {
  let dateInString: string
  let dateInObject: { start: DateInterface; finish: DateInterface } = {
    start: { day: '', month: '', year: '' },
    finish: { day: '', month: '', year: '' }
  }
  if (dateConfig.range) {
    const firstDate: string = DateToString(dateConfig.dateType, dateConfig.format, selectedDateFirst.value)
    const secondDate: string = DateToString(dateConfig.dateType, dateConfig.format, selectedDateSecond.value)
    dateInString = `${firstDate}${firstDate && secondDate ? '|' : ''}${secondDate}`
    if (
      Object.values(selectedDateFirst.value).join('') != '' &&
      Object.values(selectedDateSecond.value).join('') != ''
    ) {
      dateInObject = {
        start: selectedDateFirst.value,
        finish: selectedDateSecond.value
      }
      emit('update:value', dateInObject)
    }
  } else {
    dateInString = DateToString(dateConfig.dateType, dateConfig.format, selectedDateFirst.value)
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

  ranges.first.start = DateToObject(dateConfig.dateType, dateConfig.minDate)
  ranges.second.finish = DateToObject(dateConfig.dateType, dateConfig.maxDate)
  if (Object.values(selectedDateFirst.value).join('') != '') {
    ranges.second.start = selectedDateFirst.value
  } else {
    ranges.second.start = ranges.first.start
  }
  if (Object.values(selectedDateSecond.value).join('') != '') {
    ranges.first.finish = selectedDateSecond.value
  } else {
    ranges.first.finish = ranges.second.finish
  }

  return ranges
})
// On mounted hook
onMounted(() => {
  isShowDate.value = false
})

// Methods
function closeDatePicker(datePickerIndex: number) {
  console.log(datePickerIndex)
  if (!dateConfig.range && dateString.value.length == 10) {
    isShowDate.value = false
  } else if (datePickerIndex == 1 && dateString.value.length == 21) {
    isShowDate.value = false

  }
}
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
        {{ DateToString(dateConfig.dateType, dateConfig.format, selectedDateFirst) }}
        {{ dateConfig.range ? ' _ ' : '' }}
        {{ DateToString(dateConfig.dateType, dateConfig.format, selectedDateSecond)
        }}
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
          :format="dateConfig.format"
          :range="dateConfig.range"
          @close="closeDatePicker(0)"
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
          :format="dateConfig.format"
          :range="dateConfig.range"
          @close="closeDatePicker(1)"
        />
      </div>
    </div>
  </main>
</template>

<style lang="scss">
@import "../assets/scss/style";
</style>