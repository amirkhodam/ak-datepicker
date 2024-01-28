# Vue AK-DatePicker component
Incomplete document
## Introduction

The DatePicker component provides a simple and customizable date picker in 'jajali' and 'gregorian' calendar for Vue.js
applications.

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
  import 'ak-datepicker/style.css'
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
  <DatePicker :config="datePickerConfig" v-model:value="date" />
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

The selected date(s) are bound to the `value` variable using the `v-model` directive.

# Configuration

## Calendar configuration

You can [provide](https://vuejs.org/guide/components/provide-inject.html) configuration Object as:

```ts
import { provide } from 'vue'
import { ConfigInterface } from 'ak-datepicker'

const dateConfig: ConfigInterface = {
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
```

In other way you can pass config as props to the <DatePicker /> component:

```vue

<script setup lang="ts">
  import { ref } from 'vue'
  import { DatePicker } from 'ak-datepicker'
  import { ConfigInterface } from 'ak-datepicker'

  const dateConfig: ConfigInterface = {
    dateType: 'jalali',
    minDate: '1990-01-01',
    maxDate: '2050-01-01',
    range: true,
    format: 'yyyy-mm-dd'
  }
  const date = ref('')
</script>

<template>
  <DatePicker v-model:value="date" />
</template>
```

# Style

You must import styles to app in one of these options:

### 1. Global import:
#### For global definition you must import styles in `main.ts`:

```ts
import { createApp } from 'vue'
import 'ak-datepicker/style.css'

// Other scripts

createApp(App).mount('#app')

// Other scripts
```

### 2. Local import
#### For local definition in specific page or component you must import styles in that desired page or component like this:

```vue
<script setup lang="ts">
  // Other imports
  import { DatePicker } from 'ak-datepicker'
  import 'ak-datepicker/style.css'
  
  // Other scripts
</script>
```

## Customize colors:
```css
:root {
    --bg-main: #0e141a;
    --main-color: #70d1f2;
    --primary-color: #005297;
    --select-trigger-bg: rgb(75 85 99 / var(--select-trigger-bg-opacity));
    --select-trigger-bg-opacity: 0.2;
    --hover-color: #4b5563;
    --in-range-date-bg: #0A273F
}
```

* `--bg-main`: Background of datepicker
* `--main-color`: First color. Color of selected date.
* `--primary-color`: Primary color. Color of selected elements.
* `--select-trigger-bg`: Background of trigger (trg: Year,Month,Date) box.
* `--select-trigger-bg-opacity`: Opacity of trigger box.
* `--hover-color`: Used color for hovering act.
* `--in-range-date-bg`: Color of dates between two selected date. (range mode)