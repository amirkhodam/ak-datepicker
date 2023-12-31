# Vue AK-DatePicker component

## Introduction

The DatePicker component provides a simple and customizable date picker in 'jajali' and 'gregorian' calendar for Vue.js
applications.

## Installation

Before using the DatePicker component, ensure that you have the following dependency installed:

```sh
npm install tailwindcss@^3.4
```

or

```sh
yarn add tailwindcss@^3.4
```

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Usage

### 1. Install the DatePicker Component

```sh
npm install ak-datepicker
```

or

```sh
yarn add ak-datepicker
```

### 2. Import and Use in Your Vue Component

```vue
<script setup lang="ts">
  import { DatePicker } from 'ak-datepicker'
  import { ref } from 'vue'

  const datePickerConfig = {
    dateType: 'gregorian',
    minDate: '1990-01-01',
    maxDate: '2050-01-01',
    range: false,
    format: 'yyyy-mm-dd'
  }
  const date = ref('')
</script>

<template>
  <DatePicker :config="datePickerConfig" v-model="date" />
</template>
```

### 3. Configuration Options

* `dateType`: Type of date system, e.g., 'gregorian' or 'jalali'.
* `minDate`: Minimum selectable date.
* `maxDate`: Maximum selectable date.
* `range`: Boolean indicating whether to select a range of dates.
* `format`: Date format, e.g., 'yyyy-mm-dd'.

### 4. Example Configuration

In the sample code above, we configure the DatePicker component to use the Gregorian calendar with a date range between
1990-01-01 and 2050-01-01. The date is displayed in the format 'yyyy-mm-dd'. (Format is 'yyyy-MM-dd' right now.)

### 5. Data Binding
The selected date(s) are bound to the `date` variable using the `v-model` directive.

