import { format, getDaysInMonth, newDate } from 'date-fns-jalali'
import type { DateType } from './interfaces'

/**
 * Returns week day index
 * @type string
 * @param dateType
 * @param yearIndex
 * @param monthIndex
 * @param dayIndex
 */
export function getNewDayInMonth(
  dateType: DateType,
  yearIndex: number,
  monthIndex: number,
  dayIndex: number
): number {
  const curDate = new Date(yearIndex, monthIndex - 1, 1)
  let day
  switch (dateType) {
    case 'gregorian':
      day = curDate.getDay()
      break
    case 'jalali':
      day = newDate(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()).getDay()
      break
  }
  return day
}

/**
 * Returns current day in date type
 * @type string
 * @param dateType
 */
export function getNewDate(dateType: DateType): number {
  const curDate = new Date()
  let date
  switch (dateType) {
    case 'gregorian':
      date = curDate.getDate()
      break
    case 'jalali':
      date = newDate(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()).getDate()
      break
  }
  return date
}

/**
 * Returns current month in date type
 *
 * @type string
 * @param dateType
 */
export function getNewMonth(dateType: DateType): number {
  const curDate = new Date()
  let month
  switch (dateType) {
    case 'gregorian':
      month = curDate.getMonth()
      break
    case 'jalali':
      month = parseInt(format(curDate, 'yyyy-MM-dd').split('-')[1])
      break
  }
  return month
}

/**
 * Returns current year in date type
 * @type string
 * @param dateType
 */
export function getNewYear(dateType: DateType): number {
  const curDate = new Date()
  let year
  switch (dateType) {
    case 'gregorian':
      year = curDate.getFullYear()
      break
    case 'jalali':
      year = format(curDate, 'yyyy-MM-dd').split('-')[0]
      break
  }
  return 1402
}

/**
 * Returns days in month
 * @type string
 * @param dateType
 * @param monthIndex
 * @param yearIndex
 */
export function getDays(dateType: DateType, yearIndex: number, monthIndex: number): number {
  const curDate = new Date(yearIndex, monthIndex, 0)
  let days
  switch (dateType) {
    case 'gregorian':
      days = curDate.getDate()
      break
    case 'jalali':
      const jDate = newDate(curDate.getFullYear(), curDate.getMonth(), 1)
      days = getDaysInMonth(jDate)
      break
  }
  return days
}
