<script setup lang="ts">
import { computed, ComputedRef, inject, nextTick, onMounted, ref, watch, WritableComputedRef } from 'vue'
import type { Ref } from 'vue'
import { CalendarSingle as DatePickerSingle } from './components/index'
import DefaultConf from './assets/defaultConf.json'
import {
  ConfigInterface,
  DateInterface,
  DatePickerInterface,
  DateRangePickerInterface,
  LangInterface,
  MessagesInterface,
  StepType
} from './interfaces'
import { dateFP } from './utils/index'
import StepsTrig from './components/StepsTrig.vue'
import { getNextMonth, getPrevMonth } from './utils/date'
import { messages } from '../localization/index'

// Props from parent component
const props = defineProps<DatePickerInterface>()
const emit = defineEmits(['update:value', 'update:show'])

// Injection
const dateConfig = (inject('akDatepickerConf') || props.config || DefaultConf) as ConfigInterface

// Initialize local properties
const isShowDate: Ref<boolean> = ref(false)
const selectedDateFirst: Ref<DateInterface> = ref({ day: '', month: '', year: '' })
const selectedDateSecond: Ref<DateInterface> = ref({ day: '', month: '', year: '' })
const stepFirst: Ref<StepType> = ref('year')
const stepSecond: Ref<StepType> = ref('year')

// Computed properties
const IsShowDate: WritableComputedRef<boolean | Ref<boolean>> = computed({
  set: (newValue) => {
    if (typeof props.show === 'boolean') {
      emit('update:show', newValue)
    } else {
      isShowDate.value = newValue
    }
  },
  get: () => {
    if (typeof props.show === 'boolean') {
      return props.show
    } else {
      return isShowDate.value
    }
  }
})

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

const Messages: ComputedRef<LangInterface> = computed(() => {
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
  IsShowDate.value = false
})

// Methods
function closeDatePicker(datePickerIndex: number) {
  if (!dateConfig.range && dateString.value.length == 10) {
    IsShowDate.value = false
  } else if (datePickerIndex == 1 && dateString.value.length == 21) {
    IsShowDate.value = false

  }
}
</script>

<template>
  <main
    class="ak-relative ak_datepicker ak-h-full ak-w-full">
    <div v-if="dateConfig.withInput || dateConfig.withButton" class="ak-mb-[--trigger-caller-gap-datepicker]">
      <div v-if="dateConfig.withInput" class="ak-relative ak-h-full ak-w-full">
        <input type="text" v-model="dateString" @focus="IsShowDate = true" />
      </div>
      <div v-else-if="dateConfig.withButton" class="ak-relative ak-h-full ak-w-full">
        <button @click="IsShowDate = !IsShowDate">
          <slot name="ak-button">btn</slot>
        </button>
      </div>
    </div>
    <div
      v-if="IsShowDate"
      class="ak-absolute ak-max-h-min ak-max-w-min ak-rounded-[--main-rounded] \
             ak-bg-[var(--bg-main)] ak-px-[--main-x-padding] ak-py-[--main-y-padding] ak-text-white"
    >
      <template v-if="dateConfig.isConsecutiveMonth">
        <StepsTrig class="ak-w-1/2" v-model:step="stepFirst" :dateType="dateConfig.dateType" :messages="Messages" />
      </template>
      <br />
      <div class="ak-w-132 ak-flex ak-flex-row ak-gap-1">
        <div class="ak-w-full ak-flex ak-flex-col ak-items-center ak-justify-between ak-gap-6">
          <div v-if="!dateConfig.isConsecutiveMonth" class="ak-h-10">
            <StepsTrig v-model:step="stepFirst" :dateType="dateConfig.dateType" :messages="Messages"
                       class="ak-mb-3" />
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
            <StepsTrig v-model:step="stepSecond" :dateType="dateConfig.dateType" :messages="Messages"
                       class="ak-mb-3" />
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