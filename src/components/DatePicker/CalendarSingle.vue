<script lang="ts" setup>
// Import requirements
import { computed, onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import type {
  DateInterface,
  SinglePickerInterface,
  TriggerInterface,
  YearInterface
} from './interfaces'
import Translation from './translation.json'
import {
  getNewDate,
  getNewDayInMonth,
  getNewMonth,
  getNewYear,
  getDays
} from './date'

// Props from parent component
const props = defineProps<SinglePickerInterface>()
const emit = defineEmits(['update:date'])

// Initialize local properties
const translation = ref(
  Translation as Record<
    string,
    { months: string[]; days: string[]; status: Record<TriggerInterface, string> }
  >
)
const selectTrigger: Ref<TriggerInterface> = ref('date')
const selectedDate: Ref<DateInterface> = ref({
  year: props.date.split('-')[0] || getNewYear(props.dateType).toString() || '',
  month:
    props.date.split('-')[1] ||
    (props.isStartDatePicker
      ? addZero(getNewMonth(props.dateType).toString())
      : addZero((getNewMonth(props.dateType) + 1).toString())) ||
    '',
  day: props.date.split('-')[2] || ''
})

const dateCurrentPage: Ref<number> = ref(0)

// Computed properties
const dateString = computed((): string => {
  const strDate: string = Object.values(selectedDate.value).join('-')
  return strDate.length == 10 ? strDate : ''
})

const firstDayOfMonth = computed((): number => {
  const monthIndex: number = parseInt(selectedDate.value.month) || getNewMonth(props.dateType)
  const yearIndex: number = parseInt(selectedDate.value.year) || getNewYear(props.dateType)
  return getNewDayInMonth(props.dateType, yearIndex, monthIndex, 1)
})

const yearRange = computed((): YearInterface => {
  const range = ref([] as number[])
  if (props.maxDate && props.minDate) {
    range.value = [parseInt(props.minDate.year), parseInt(props.maxDate.year)]
  } else {
    range.value = [getNewYear(props.dateType) - 20, getNewYear(props.dateType) + 20]
  }
  return {
    range: range.value,
    pages: Math.floor((range.value[1] - range.value[0]) / 20) + 1
  }
})

// Mounted hook
onMounted(() => {
  const dateCheck: boolean =
    selectedDate.value.year != '' && selectedDate.value.month != '' && selectedDate.value.day != ''
  selectTrigger.value = dateCheck ? 'date' : 'year'
})

// Methods
function setDate(day: string): void {
  if (day != '' && dateInRangeChecker(day)) {
    selectedDate.value.day = addZero(day.toString())
    emit('update:date', dateString.value)
  }
}

function setYear(duration: number, year: number): void {
  selectedDate.value.year = getYear(duration, year).toString()
  selectTrigger.value = 'month'
}

function setMonth(season: number, month: number): void {
  const monthSelected: number = (season - 1) * 3 + month
  if (monthInRangeChecker(monthSelected.toString())) {
    selectedDate.value.month = addZero(((season - 1) * 3 + month).toString())
    selectTrigger.value = 'date'
  }
}

function addZero(num: string): string {
  return parseInt(num) < 10 ? `0${num}` : num
}

function getYear(duration: number, yearIndex: number): string {
  const year =
    yearRange.value.range[0] + (duration - 1) * 5 + yearIndex - 1 + dateCurrentPage.value * 20
  return year <= yearRange.value.range[1] ? year.toString() : ''
}

function getDay(week: number, dayIndex: number): string {
  let day = (week - 1) * 7 + dayIndex - firstDayOfMonth.value
  if (props.dateType == 'jalali') {
    day -= 1
  } // Minus 1 because week starts from saturday in jalali
  return day > 0 &&
  day <=
  getDays(props.dateType, parseInt(selectedDate.value.year), parseInt(selectedDate.value.month))
    ? day.toString()
    : ''
}

function monthInRangeChecker(month: string): boolean {
  if (
    parseInt(selectedDate.value.year) < yearRange.value.range[1] &&
    parseInt(selectedDate.value.year) > yearRange.value.range[0]
  ) {
    return true
  } else if (parseInt(selectedDate.value.year) == yearRange.value.range[1]) {
    const maxMonth = props.maxDate ? parseInt(props.maxDate.month) : getNewMonth(props.dateType) - 1
    return parseInt(month) <= maxMonth
  } else if (parseInt(selectedDate.value.year) == yearRange.value.range[0]) {
    const minMonth = props.minDate ? parseInt(props.minDate.month) : getNewMonth(props.dateType) - 1
    return parseInt(month) >= minMonth
  } else {
    return false
  }
}

function selectedDayChecker(day: string): boolean {
  if (day) {
    return parseInt(day) == parseInt(selectedDate.value.day)
  } else {
    return false
  }
}

function SelectedDateInRangeChecker(curDay: string): boolean {
  if (props.isStartDatePicker && curDay != '' && selectedDate.value.day != '') {
    return parseInt(curDay) > parseInt(selectedDate.value.day)
  } else if (curDay != '') {
    return parseInt(curDay) < parseInt(selectedDate.value.day)
  } else {
    return false
  }
}

function dateInRangeChecker(day: string): boolean {
  if (monthInRangeChecker(selectedDate.value.month)) {
    if (parseInt(selectedDate.value.year) == yearRange.value.range[1]) {
      const maxMonth = props.maxDate ? parseInt(props.maxDate.month) : 12
      const selectedMonth = selectedDate.value.month
      const maxDay = props.maxDate ? props.maxDate.day : '31'
      return (
        parseInt(selectedMonth) < maxMonth ||
        (parseInt(selectedMonth) == maxMonth && parseInt(day) <= parseInt(maxDay))
      )
    } else if (parseInt(selectedDate.value.year) == yearRange.value.range[0]) {
      const minMonth = props.minDate ? parseInt(props.minDate.month) : getNewMonth(props.dateType)
      const selectedMonth = selectedDate.value.month
      const maxDay = props.minDate ? props.minDate.day : '1'
      return (
        parseInt(selectedMonth) > minMonth ||
        (parseInt(selectedMonth) == minMonth && parseInt(day) >= parseInt(maxDay))
      )
    } else {
      return true
    }
  } else {
    return false
  }
}
</script>

<template>
  <main class="ak-border-3 ak-flex ak-flex-col ak-gap-0.5">
    <div
      class="ak-mx-auto ak-mb-3 ak-flex ak-max-w-min ak-flex-row ak-gap-0.5 ak-rounded ak-bg-[--select-trigger-bg] ak-p-1"
    >
      <button
        v-for="(status, key, index) in translation[dateType].status"
        :class="{
          'ak-bg-[var(--primary-color)]': selectTrigger == key.toString(),
          'ak-py-0.5': true,
          'ak-px-1': true,
          'ak-rounded': true
        }"
        :key="`statusTrigger-${index}`"
        @click="selectTrigger = key"
      >
        {{ status.charAt(0).toUpperCase() + status.slice(1) }}
      </button>
    </div>
    <div class="ak-mx-auto ak-flex ak-min-w-min ak-flex-row ak-gap-0.5">
      <span class="ak-text-base ak-font-normal ak-text-[--main-color]">
        {{ selectedDate.year }}
        {{ translation[props.dateType].months[parseInt(selectedDate.month) - 1] }}
      </span>
    </div>
    <div>
      <div name="selectionBox" id="selectionBox">
        <div class="ak-h-60 ak-w-60" name="years" id="selectionYear" v-if="selectTrigger === 'year'">
          <div name="yearNav" class="ak-flex ak-h-6 ak-flex-row ak-justify-between">
            <button
              :class="{
                'ak-cursor-default ak-opacity-50': !(dateCurrentPage > 0)
              }"
              @click="
                () => {
                  if (dateCurrentPage > 0) {
                    dateCurrentPage--
                  }
                }
              "
            >
              &lt;
            </button>
            <button
              :class="{
                'ak-cursor-default ak-opacity-50': !(dateCurrentPage < yearRange.pages - 1)
              }"
              @click="
                () => {
                  if (dateCurrentPage < yearRange.pages - 1) {
                    dateCurrentPage++
                  }
                }
              "
            >
              &gt;
            </button>
          </div>
          <table class="ak-h-full ak-w-full ak-overflow-hidden ak-p-1" name="years">
            <tr v-for="duration in 4" :key="`duration-${duration}`">
              <td
                :class="{
                'ak-text-center': true,
                 'ak-cursor-pointer hover:ak-bg-[--hover-color]' : getYear(duration, year) != ''
              }"
                v-for="year in 5"
                :key="`year-${year}`"
                @click="setYear(duration, year)"
              >
                {{ getYear(duration, year) }}
              </td>
            </tr>
          </table>
        </div>
        <div class="ak-h-60 ak-w-60" name="months" v-else-if="selectTrigger === 'month'">
          <div class="ak-flex ak-h-6"></div>
          <table class="ak-h-full ak-w-full">
            <tr v-for="season in 4" :key="`season-${season}`">
              <td
                :class="{
                  'ak-text-center': true,
                  'ak-opacity-50': !monthInRangeChecker(((season - 1) * 3 + month).toString()),
                  'ak-cursor-pointer hover:ak-bg-[--hover-color]': monthInRangeChecker(
                    ((season - 1) * 3 + month).toString()
                  )
                }"
                v-for="month in 3"
                :key="`month-${month}`"
                @click="setMonth(season, month)"
              >
                {{ translation[dateType].months[(season - 1) * 3 + month - 1] }}
              </td>
            </tr>
          </table>
        </div>
        <div class="ak-h-60 ak-w-60" name="days" v-else-if="selectTrigger === 'date'">
          <div class="ak-flex ak-h-6"></div>
          <table class="ak-h-full ak-w-full">
            <thead>
            <tr class="ak-h-3 ak-pb-1">
              <td
                v-for="weekDay in translation[dateType].days"
                :key="`weekDay-${weekDay}`"
                class="ak-pb-1 ak-text-center ak-text-sm ak-font-light"
              >
                {{ dateType == 'gregorian' ? weekDay.substring(0, 3) : weekDay[0] }}
              </td>
            </tr>
            </thead>
            <tr v-for="week in 6" :key="`week-${week}`">
              <td
                v-for="day in 7"
                :key="`day-${day}`"
                :class="{
                  'ak-text-center': true,
                  'ak-flex-inline ak-h-8 ak-w-8 ak-items-center ak-justify-center': true,
                  'ak-bg-[--primary-color]': selectedDayChecker(getDay(week, day)),
                  'ak-translate ak-bg-[--in-range-date-bg] ak-bg-opacity-[0.7]': SelectedDateInRangeChecker(
                    getDay(week, day)
                  ),
                  'ak-cursor-pointer hover:ak-bg-[--hover-color]':
                    getDay(week, day) != '' && dateInRangeChecker(getDay(week, day).toString()),
                  'ak-opacity-50': !dateInRangeChecker(getDay(week, day).toString())
                }"
                @click="setDate(getDay(week, day).toString())"
              >
                <span>
                  {{ getDay(week, day) }}
                </span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>
