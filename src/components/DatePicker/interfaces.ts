/**
 * ```ts
 *  DateType = 'jalali' | 'gregorian'
 *  ```
 **/
export type DateType = 'jalali' | 'gregorian'

/**
 * ```ts
 *  {
 *    dateType: DateType
 *    range: boolean
 *    minDate: string
 *    maxDate: string
 *    format: string
 *  }
 *  ```
 **/
export interface ConfigInterface {
  dateType: DateType
  range: boolean
  minDate: string
  maxDate: string
  format: string
}

/**
 * ```ts
 *  {
 *    year: string,
 *    month: string,
 *    day: string
 *  }
 *  ```
 **/
export interface DateInterface {
  year: string
  month: string
  day: string
}

/**
 * ```ts
 *  {
 *    year: string,
 *    month: string,
 *    day: string
 *  }
 *  ```
 **/
export interface DateRangeInterface {
  start: DateInterface
  finish: DateInterface
}

/**
 * ```ts
 *  {
 *   first: DateRangeInterface[],
 *   second: DateRangeInterface[]
 *  }
 *  ```
 **/
export interface DateRangePickerInterface {
  first: DateRangeInterface
  second: DateRangeInterface
}

/**
 * ```ts
 *  'date' | 'month' | 'year'
 *  ```
 **/
export type TriggerInterface = 'date' | 'month' | 'year'

/**
 * ```ts
 *  {
 *   range: number[]
 *   pages: number
 * }
 *  ```
 **/
export interface YearInterface {
  range: number[]
  pages: number
}

/**
 * ```ts
 *  {
 *    value: string
 *    config?: ConfigInterface
 *  }
 *  ```
 **/
export interface DatePickerInterface {
  value: string
  config?: ConfigInterface
}

/**
 * ```ts
 *  {
 *    date: string
 *    minDate: string
 *    maxDate: string
 *    dateType: DateType
 *    isStartDatePicker: boolean
 *  }
 *  ```
 **/
export interface SinglePickerInterface {
  date: DateInterface
  minDate: DateInterface
  maxDate: DateInterface
  dateType: DateType
  isStartDatePicker: boolean
  format: string
  range: boolean
}

// Method props
/**
 *
 */
