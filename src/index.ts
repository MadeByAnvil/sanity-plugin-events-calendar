import {CalendarIcon} from '@sanity/icons'
import {definePlugin} from 'sanity'

import {schemaTypes} from './schemas'
import CalendarTool from './tools/CalendarTool'

// Note: Styling is handled through styled-components
// No separate CSS import is needed

/**
 * Calendar plugin for Sanity Studio
 *
 * Usage in `sanity.config.ts` (or .js)
 *
 * ```ts
 * import {defineConfig} from 'sanity'
 * import {calendarPlugin} from 'sanity-plugin-events-calendar'
 *
 * export default defineConfig({
 *   // ...
 *   plugins: [calendarPlugin()],
 * })
 * ```
 *
 * @public
 */
export const calendarPlugin = definePlugin(() => {
  return {
    name: 'sanity-plugin-events-calendar',
    schema: {
      types: schemaTypes,
    },
    tools: [
      {
        name: 'calendar',
        title: 'Calendar',
        icon: CalendarIcon,
        component: CalendarTool,
      },
    ],
  }
})

// Export schema types for direct usage
/**
 * Schema types exported by the calendar plugin
 * @public
 */
export {schemaTypes}
