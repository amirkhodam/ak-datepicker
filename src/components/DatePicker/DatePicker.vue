<script setup lang="ts">
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { CalendarSingle as DatePickerSingle } from './components/index'
import DefaultConf from './assets/defaultConf.json'
import type {
  ConfigInterface, DateInterface,
  DatePickerInterface,
  DateRangePickerInterface, MessagesInterface, StepType
} from './interfaces'
import { dateFP } from './utils/index'
import StepsTrig from './components/StepsTrig.vue'
import { getNextMonth, getPrevMonth } from './utils/date'
import { messages } from '../localization/index'

// Props from parent component
const props = defineProps<DatePickerInterface>()
const emit = defineEmits(['update:value'])

// Injection
const dateConfig = (inject('akDatepickerConf') || props.config || DefaultConf) as ConfigInterface

// Initialize local properties
const isShowDate: Ref<boolean> = ref(false)
const selectedDateFirst: Ref<DateInterface> = ref({ day: '', month: '', year: '' })
const selectedDateSecond: Ref<DateInterface> = ref({ day: '', month: '', year: '' })
const stepFirst: Ref<StepType> = ref('year')
const stepSecond: Ref<StepType> = ref('year')

// Computed properties
const StepSecond = computed(() => {
  return dateConfig.isConsecutiveMonth ? 'date' : 'year'
})

const dateString = computed(() => {
  let dateInString: string
  let dateInObject: { start: DateInterface; finish: DateInterface } = {
    start: { day: '', month: '', year: '' },
    finish: { day: '', month: '', year: '' }
  }
  if (dateConfig.range) {
    const firstDate: string = dateFP.DateToString(dateConfig.dateType, dateConfig.format, selectedDateFirst.value)
    const secondDate: string = dateFP.DateToString(dateConfig.dateType, dateConfig.format, selectedDateSecond.value)
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
    dateInString = dateFP.DateToString(dateConfig.dateType, dateConfig.format, selectedDateFirst.value)
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

  ranges.first.start = dateFP.DateToObject(dateConfig.dateType, dateConfig.minDate)
  ranges.second.finish = dateFP.DateToObject(dateConfig.dateType, dateConfig.maxDate)
  if (
    Object.values(selectedDateFirst.value).join('') != '' &&
    !dateConfig.isConsecutiveMonth
  ) {
    ranges.second.start = selectedDateFirst.value
  } else {
    ranges.second.start = ranges.first.start
  }
  if (
    Object.values(selectedDateSecond.value).join('') != '' &&
    !dateConfig.isConsecutiveMonth
  ) {
    ranges.first.finish = selectedDateSecond.value
  } else {
    ranges.first.finish = ranges.second.finish
  }

  return ranges
})

const isNotConsecutive = computed(() => {
  return (dateConfig.isConsecutiveMonth &&
      selectedDateFirst.value.year != '' &&
      selectedDateFirst.value.month != '' &&
      stepFirst.value === 'date') ||
    !dateConfig.isConsecutiveMonth
})

const Lang = computed(() => {
  if (props.lang) {
    return props.lang
  } else {
    return 'en'
  }
})

const Messages = computed(() => {
  if (props.messages) {
    return props.messages[Lang.value]
  } else {
    return (messages as MessagesInterface)[Lang.value]
  }
})
// Watcher
watch(stepFirst, (newStep, oldStep) => {
  if (oldStep === 'month') {
    const newMonth: string = selectedDateFirst.value.month
    selectedDateSecond.value.year = selectedDateFirst.value.year
    if (newMonth != '' && dateConfig.isConsecutiveMonth) {
      if (!dateConfig.nextMonth) {
        selectedDateSecond.value.month = newMonth
        nextTick(() => {
          selectedDateFirst.value.month = getPrevMonth(newMonth)
        })
      } else {
        selectedDateSecond.value.month = getNextMonth(newMonth)
      }
    }
  }
})
// On mounted hook
onMounted(() => {
  isShowDate.value = false
})

// Methods
function closeDatePicker(datePickerIndex: number) {
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
      <template v-if="dateConfig.isConsecutiveMonth">
        <StepsTrig class="ak-w-1/2" v-model:step="stepFirst" :dateType="dateConfig.dateType" :messages="Messages" />
      </template>
      <p class="ak-mx-auto ak-block ak-h-3 ak-max-w-max ak-font-semibold ak-text-[color:var(--main-color)]">
        {{ dateFP.DateToString(dateConfig.dateType, dateConfig.format, selectedDateFirst) }}
        {{ dateConfig.range ? ' _ ' : '' }}
        {{ dateFP.DateToString(dateConfig.dateType, dateConfig.format, selectedDateSecond)
        }}
      </p>
      <br />
      <div class="ak-w-132 ak-flex ak-flex-row ak-gap-1">
        <div class="ak-w-full ak-flex ak-flex-col ak-items-center ak-justify-between ak-gap-6">
          <div v-if="!dateConfig.isConsecutiveMonth" class="ak-h-10">
            <StepsTrig v-model:step="stepFirst" :dateType="dateConfig.dateType" :messages="Messages" />
          </div>
          <DatePickerSingle
            :class="{
            'ak-w-full': !isNotConsecutive,
            'ak-w-60': isNotConsecutive,
            }"
            v-model:step="stepFirst"
            name="startDate"
            v-model:date="selectedDateFirst"
            :dateType="dateConfig.dateType"
            :minDate="dateRange.first.start"
            :maxDate="dateRange.first.finish"
            :isStartDatePicker="true"
            :format="dateConfig.format"
            :range="dateConfig.range"
            :lang="Lang"
            :messages="Messages"
            @close="closeDatePicker(0)"
          />
        </div>
        <br />
        <div v-if="isNotConsecutive" class="ak-flex ak-flex-col ak-items-center ak-justify-between ak-gap-6">
          <div v-if="!dateConfig.isConsecutiveMonth" class="ak-h-10">
            <StepsTrig v-model:step="stepSecond" :dateType="dateConfig.dateType" :messages="Messages" />
          </div>
          <DatePickerSingle
            class="ak-w-60"
            v-model:step="StepSecond"
            name="finishDate"
            v-if="dateConfig.range"
            v-model:date="selectedDateSecond"
            :dateType="dateConfig.dateType"
            :minDate="dateRange.second.start"
            :maxDate="dateRange.second.finish"
            :isStartDatePicker="false"
            :format="dateConfig.format"
            :range="dateConfig.range"
            :lang="Lang"
            :messages="Messages"
            @close="closeDatePicker(1)"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
@import "../assets/scss/style";
</style>