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
 *    withInput: boolean
 *    withButton: boolean
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
  withInput: boolean
  withButton: boolean
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
 * Language (Translation) interface
 * ```json
 *  {
 *     from: string
 *     to: string
 *     status: {
 *       year: string
 *       month: string
 *       date: string
 *     }
 *     jalali: {
 *       months: string[]
 *       days: {
 *         [day: string]: string
 *       }
 *     }
 *     gregorian: {
 *       months: string[]
 *       days: {
 *         [day: string]: string
 *       }
 *     }
 *   }
 *  ```
 *  */
export interface LangInterface {
  from: string
  to: string
  status: {
    year: string
    month: string
    date: string
  }
  jalali: {
    months: string[]
    days: {
      sat: string
      sun: string
      mon: string
      tue: string
      wen: string
      thu: string
      fri: string
    }
  }
  gregorian: {
    months: string[]
    days: {
      sat: string
      sun: string
      mon: string
      tue: string
      wen: string
      thu: string
      fri: string
    }
  }

}

/**
 * Messages (Translation) interface
 * ```json
 *  {
 *      [lang: string]: {
 *     from: string
 *     to: string
 *     status: {
 *       year: string
 *       month: string
 *       date: string
 *     }
 *     jalali: {
 *       months: string[]
 *       days: {
 *         [day: string]: string
 *       }
 *     }
 *     gregorian: {
 *       months: string[]
 *       days: {
 *         [day: string]: string
 *       }
 *     }
 *   }
 *  }
 *  ```
 *  */
export interface MessagesInterface {
  [lang: string]: LangInterface
}

/**
 * ```json
 *  {
 *    show?: any
 *    value: string
 *    config?: ConfigInterface
 *    lang: string[2]
 *    messages: MessagesInterface
 *  }
 *  ```
 **/
export interface DatePickerInterface {
  show?: any // must check it be boolean (Vue init it false by default)
  value: string
  config?: ConfigInterface
  lang?: string[2]
  messages?: MessagesInterface
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
 *    lang: string[2]
 *    messages: LangInterface,
 *    relative: boolean
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
  lang: string[2]
  messages: LangInterface
  relative: boolean
}

// Steps Props
/**
 * ```json
 *  {
 *    step: Step
 *    dateType: DateType
 *    messages: LangInterface
 *  }
 *  ```
 *  */
export interface StepsPropsInterface {
  step: StepType
  dateType: DateType
  messages: LangInterface
}

// Week Days
/**
 * ```json
 *  WeekDayType = 'sun' | 'mon' | 'tue' | 'wen' | 'thu' | 'fri' | 'sat'
 *  ```
 *  */
export type WeekDayType = 'sun' | 'mon' | 'tue' | 'wen' | 'thu' | 'fri' | 'sat'