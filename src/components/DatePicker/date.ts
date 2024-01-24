import { format, getDaysInMonth, newDate } from 'date-fns-jalali'
import { format as geFormat } from 'date-fns'
import type { DateInterface, DateType } from './interfaces'

/**
 * Returns week day index
 * @type string
 * @param dateType
 * @param yearIndex
 * @param monthIndex
 */
export function getNewDayInMonth(
  dateType: DateType,
  yearIndex: number,
  monthIndex: number
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
  let jDate: Date = new Date()
  let days
  switch (dateType) {
    case 'gregorian':
      days = curDate.getDate()
      break
    case 'jalali':
      jDate = newDate(curDate.getFullYear(), curDate.getMonth(), 1)
      days = getDaysInMonth(jDate)
      break
  }
  return days
}


/**
 * Returns Formatted date in string
 * @type string
 * @param dateType
 * @param formatDate
 * @param date
 */
export function DateToString(dateType: DateType, formatDate: string, date: DateInterface) {
  try {
    let dateFormattedStr: string = ''
    switch (dateType) {
      case 'jalali':
        dateFormattedStr = format(
          newDate(
            parseInt(date.year),
            parseInt(date.month) - 1,
            parseInt(date.day)
          ),
          formatDate)
        break
      case 'gregorian':
        dateFormattedStr = geFormat(new Date(
          parseInt(date.year),
          parseInt(date.month),
          parseInt(date.day)
        ), formatDate)
        break
    }
    return dateFormattedStr.length == 10 ? dateFormattedStr : ''
  } catch (e) {
    return ''
  }
}

/**
 * Returns Object of date
 * @type DateInterface* @param separator
 * @param dateType
 * @param date
 * @param separator
 */
export function DateToObject(dateType: DateType, date: string) {
  let dateInArray: string[] = []
  switch (dateType) {
    case 'jalali':
      dateInArray = [
        date.substring(8, 10),
        date.substring(5, 7),
        date.substring(0, 4)
      ]
      break
    case 'gregorian':
      dateInArray = [
        new Date(date).getDate().toString(),
        new Date(date).getMonth().toString(),
        new Date(date).getFullYear().toString()
      ]
      break
  }
  const dateObject: DateInterface = {
    day: dateInArray[0],
    month: dateInArray[1],
    year: dateInArray[2]
  }
  return dateObject
}