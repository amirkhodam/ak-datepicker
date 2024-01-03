import { provide } from 'vue'

const dateConfig = {
  "dateType": "jalali",
  "minDate": "1990-01-01",
  "maxDate": "2050-01-01",
  "range": true,
  "format": "yyyy-mm-dd"
}

export default {
  setup() {
    provide('akDatepickerConf', dateConfig)
  }
}