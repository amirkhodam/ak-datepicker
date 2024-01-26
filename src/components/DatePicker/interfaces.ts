/**
 * ```json
 *  DateType = 'jalali' | 'gregorian'
 *  ```
 **/
export type DateType = 'jalali' | 'gregorian'

/**
 * ```json
 *  {
 *    dateType: DateType
 *    range: boolean
 *    minDate: string
 *    maxDate: string
 *    format: string
 *    isConsecutiveMonth: boolean
 *    nextMonth: boolean
 *  }
 *  ```
 **/
export interface ConfigInterface {
  dateType: DateType
  range: boolean
  minDate: string
  maxDate: string
  format: string
  isConsecutiveMonth: boolean
  nextMonth: boolean
}

/**
 * ```json
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
 * ```json
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
 * ```json
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
 * ```json
 *  'date' | 'month' | 'year'
 *  ```
 **/
export type StepType = 'date' | 'month' | 'year'

/**
 * ```json
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
 * ```json
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
 * ```json
 *  {
 *    step: Step
 *    date: DateInterface
 *    minDate: DateInterface
 *    maxDate: DateInterface
 *    dateType: DateType
 *    isStartDatePicker: boolean
 *    format: string
 *    range: boolean
 *  }
 *  ```
 **/
export interface SinglePickerInterface {
  step: StepType
  date: DateInterface
  minDate: DateInterface
  maxDate: DateInterface
  dateType: DateType
  isStartDatePicker: boolean
  format: string
  range: boolean
}

// Steps Props
/**
 * ```json
 *  {
 *    step: Step
 *    dateType: DateType
 *  }
 *  ```
 *  */
export interface StepsPropsInterface {
  step: StepType
  dateType: DateType
}

