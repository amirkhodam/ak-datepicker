<script lang="ts" setup>
// Import requirements
import { computed, reactive, ref } from 'vue'
import type { Ref, ComputedRef, UnwrapNestedRefs } from 'vue'
import {
  DateInterface,
  SinglePickerInterface, WeekDayType,
  YearInterface
} from '../interfaces'
import { dateFP } from '../utils/index'

// Props from parent component
const props = defineProps<SinglePickerInterface>()
/**
 *  Emits: Only for date changes
 *  ```ts
 *    emit('update:date', dateString.value)
 *  ```
 */
const emit = defineEmits(['update:date', 'update:step', 'close'])

// Initialize local properties
const weekDays: WeekDayType[] = ['sun', 'mon', 'tue', 'wen', 'thu', 'fri', 'sat']
const weekDaysFromSat: WeekDayType[] = ['sat', 'sun', 'mon', 'tue', 'wen', 'thu', 'fri']

const selectedDate: UnwrapNestedRefs<DateInterface> = reactive(props.date)

const dateCurrentPage: Ref<number> = ref(0)

// Computed properties
/**
 * @type ComputedRef<number>
 * @example
 * 5 (It means Friday=sixth day)
 * @returns Index of first week day of selected month 0-7
 */
const firstDayOfMonth: ComputedRef<number> = computed((): number => {
  const monthIndex: number = parseInt(selectedDate.month) || dateFP.getNewMonth(props.dateType)
  const yearIndex: number = parseInt(selectedDate.year) || dateFP.getNewYear(props.dateType)
  return dateFP.getNewDayInMonth(props.dateType, yearIndex, monthIndex)
})

/**
 * @type ComputedRef<YearInterface>
 * @example
 * {
 *   range: [2003, 2043]
 *   pages: 2 // 20 years per page
 * }
 * @returns Limitation of selectable year range and number of page
 */
const yearRange: ComputedRef<YearInterface> = computed((): YearInterface => {
  const range = ref([] as number[])
  if (props.maxDate && props.minDate) {
    range.value = [parseInt(props.minDate.year), parseInt(props.maxDate.year)]
  } else {
    range.value = [dateFP.getNewYear(props.dateType) - 20, dateFP.getNewYear(props.dateType) + 20]
  }
  return {
    range: range.value,
    pages: Math.floor((range.value[1] - range.value[0]) / 20) + 1
  }
})

/**
 * @type ComputedRef<boolean>
 * @example
 * {
 *   range: [2003, 2043]
 *   pages: 2 // 20 years per page
 * }
 * @returns Limitation of selectable year range and number of page
 */
const selectedDay: ComputedRef<number> = computed((): number => {
  return parseInt(selectedDate.day)
})

const WeekDays: ComputedRef<WeekDayType[]> = computed(() => {
  if (props.dateType == 'jalali') {
    return weekDaysFromSat
  } else {
    return weekDays
  }
})

// Methods
/**
 * Mutate selectedDate['date'] and call update:date emit
 * @param day
 * @type void
 * @example
 * setDate('10')
 */
function setDate(day: string): void {
  if (day != '' && dateInRangeChecker(day)) {
    selectedDate.day = addZero(day.toString())
    emit('update:date', selectedDate)
    emit('close')
  }
}

/**
 * Mutate selectedDate['year']. It gets row and col of years in table and get right year from
 * getYear() then declare year in selectedDate
 * @param duration
 * @param year
 * @type void
 * @example
 * setYear(1, 5)
 */
function setYear(duration: number, year: number): void {
  selectedDate.year = getYear(duration, year).toString()
  emit('update:step', 'month')
}


/**
 * Mutate selectedDate['month']. It gets row and col of month in table and declare month in selectedDate
 * @type void
 * @example
 * setMonth(1, 2)
 * @param season
 * @param month
 */
function setMonth(season: number, month: number): void {
  const monthSelected: number = (season - 1) * 3 + month
  if (monthInRangeChecker(monthSelected.toString())) {
    selectedDate.month = addZero(((season - 1) * 3 + month).toString())
    emit('update:step', 'date')
  }
}

/**
 * Add 0 in start of date and month lower then 10
 * @type string
 * @example
 * ```ts
 * const month: string = addZero('2')
 * console.log(month) // "02"
 * ```
 * @param num
 */
function addZero(num: string): string {
  return parseInt(num) < 10 ? `0${num}` : num
}


/**
 * Gets duration and year from table of years and returns right year
 * @type string
 * @example
 * ```ts
 * setMonth(1, 2)
 * ```
 * @param duration
 * @param yearIndex
 */
function getYear(duration: number, yearIndex: number): string {
  const year =
    yearRange.value.range[0] + (duration - 1) * 5 + yearIndex - 1 + dateCurrentPage.value * 20
  return year <= yearRange.value.range[1] ? year.toString() : ''
}

/**
 * Gets week and day index from date table and returns right date.
 * If that index be out of month, function returns null string ('')
 * @example
 * Selected month in the selected year starts from Tuesday and finish in Thursday. So, Sunday and Monday in first week and
 * Friday and Saturday will be null string.
 * @type string
 * @example
 * ```ts
 * getDay(1, 2) // Means first week and second index of this week
 * ```
 * @param week
 * @param dayIndex
 */
function getDay(week: number, dayIndex: number): string {
  let day = (week - 1) * 7 + dayIndex - firstDayOfMonth.value
  if (props.dateType == 'jalali') {
    day -= 1
  } // Minus 1 because week starts from saturday in jalali
  return day > 0 &&
  day <=
  dateFP.getDays(props.dateType, parseInt(selectedDate.year), parseInt(selectedDate.month))
    ? day.toString()
    : ''
}

/**
 * This function check if the month is in the min and max range or not and returns "true" or "false"
 * @type boolean
 * @example
 * ```ts
 * monthInRangeChecker(1)
 * ```
 * @param month
 */
function monthInRangeChecker(month: string): boolean {
  const selectedYear: number = parseInt(selectedDate.year)
  const { range } = yearRange.value
  if (selectedYear < range[1] && selectedYear > range[0]) {
    return true
  } else if (selectedYear == range[1]) {
    const maxMonth = props.maxDate ? parseInt(props.maxDate.month) : dateFP.getNewMonth(props.dateType) - 1
    return parseInt(month) <= maxMonth
  } else if (selectedYear == range[0]) {
    const minMonth = props.minDate ? parseInt(props.minDate.month) : dateFP.getNewMonth(props.dateType) - 1
    return parseInt(month) >= minMonth
  } else {
    return false
  }
}

/**
 * This function check if the day is in the selected date range or not and returns "true" or "false"
 * @type boolean
 * @example
 * ```ts
 * SelectedDateInRangeChecker(1)
 * ```
 * @param day
 */
function SelectedDateInRangeChecker(day: string): boolean {
  if (props.isStartDatePicker && day != '' && selectedDate.day != '' && props.range) {
    return parseInt(day) > parseInt(selectedDate.day)
  } else if (day != '' && props.range) {
    return parseInt(day) < parseInt(selectedDate.day)
  } else {
    return false
  }
}

/**
 * This function check if the day is in the min and max date range or not and returns "true" or "false"
 * @type boolean
 * @example
 * ```ts
 * dateInRangeChecker('02')
 * ```
 * @param day
 */
function dateInRangeChecker(day: string): boolean {
  if (!monthInRangeChecker(selectedDate.month)) {
    return false
  }

  const selectedYear = parseInt(selectedDate.year)
  const { range } = yearRange.value
  if (selectedYear === range[1]) {
    const maxMonth = props.maxDate ? parseInt(props.maxDate.month) : 12
    const selectedMonth = parseInt(selectedDate.month)
    const maxDay = props.maxDate ? parseInt(props.maxDate.day) : 31
    return selectedMonth < maxMonth || (selectedMonth === maxMonth && parseInt(day) <= maxDay)
  }

  if (selectedYear === range[0]) {
    const minMonth = props.minDate ? parseInt(props.minDate.month) : dateFP.getNewMonth(props.dateType)
    const selectedMonth = parseInt(selectedDate.month)
    const minDay = props.minDate ? parseInt(props.minDate.day) : 1
    return selectedMonth > minMonth || (selectedMonth === minMonth && parseInt(day) >= minDay)
  }

  return true
}
</script>

<template>
  <main class="ak-border-3 ak-flex ak-flex-col ak-gap-0.5">
    <div>
      <div name="selectionBox" id="selectionBox">
        <div class="ak-min-h-60 h-full ak-w-full" name="years" id="selectionYear" v-if="step === 'year'">
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
          <table class="ak-min-h-60 ak-w-full ak-overflow-hidden ak-p-1" name="years">
            <tr v-for="duration in 4" :key="`duration-${duration}`">
              <td
                :class="{
                'ak-text-center': true,
                 'ak-cursor-pointer hover:ak-bg-[--calendar-hover-color] hover:ak-rounded-[--calendar-hover-year-radius]' : getYear(duration, year) != ''
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
        <div v-else-if="step === 'month'" class="ak-h-60 ak-w-full" name="months">
          <table class="ak-h-full ak-w-full">
            <tr v-for="season in 4" :key="`season-${season}`">
              <td
                :class="{
                  'ak-text-center': true,
                  'ak-opacity-50': !monthInRangeChecker(((season - 1) * 3 + month).toString()),
                  'ak-cursor-pointer hover:ak-bg-[--calendar-hover-color] hover:ak-rounded-[--calendar-hover-month-radius]': monthInRangeChecker(
                    ((season - 1) * 3 + month).toString()
                  )
                }"
                v-for="month in 3"
                :key="`month-${month}`"
                @click="setMonth(season, month)"
              >
                {{ props.messages[props.dateType].months[(season - 1) * 3 + month - 1] }}
              </td>
            </tr>
          </table>
        </div>
        <div v-else-if="step === 'date'" class="ak-h-full ak-w-full" name="days">
          <div class="ak-flex ak-h-6"></div>
          <table class="ak-h-full ak-w-full">
            <thead>
            <tr class="ak-h-3 ak-pb-1">
              <td
                v-for="weekDay in WeekDays"
                :key="`weekDay-${weekDay}`"
                class="ak-w-10 ak-pb-1 ak-text-center ak-text-sm ak-font-light"
                style="font-size: var(--calendar-week-days-font-size)"
              >
                {{ props.lang == 'fa' ? props.messages[dateType].days[weekDay][0] : weekDay.substring(0, 3).toUpperCase()
                }}
              </td>
            </tr>
            </thead>
            <tr v-for="week in 6" :key="`week-${week}`">
              <td
                v-for="day in 7"
                :key="`day-${day}`"
                :class="{
                  'ak-text-center': true,
                  'ak-flex-inline ak-h-10 ak-w-10 ak-items-center ak-justify-center': true,
                  'ak-bg-[--calendar-is-range-date-bg]': selectedDay == parseInt(getDay(week, day)),
                  'ak-rounded-l-[--calendar-is-range-radius]': selectedDay == parseInt(getDay(week, day)) && isStartDatePicker,
                  'ak-rounded-r-full': selectedDay == parseInt(getDay(week, day)) && !isStartDatePicker,
                  'ak-translate ak-bg-[--calendar-in-range-date-bg] ak-bg-opacity-[0.7] hover:ak-rounded-none': SelectedDateInRangeChecker(
                    getDay(week, day)
                  ),
                  'ak-cursor-pointer hover:ak-bg-[--calendar-hover-color]':
                    getDay(week, day) != '' && dateInRangeChecker(getDay(week, day).toString()),
                  'ak-opacity-50': !dateInRangeChecker(getDay(week, day).toString()),
                  'hover:ak-rounded-[--calendar-hover-date-radius]':
                    getDay(week, day) != '' &&
                    dateInRangeChecker(getDay(week, day).toString()) &&
                    selectedDay != parseInt(getDay(week, day))&&
                    !SelectedDateInRangeChecker(getDay(week, day)),
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
