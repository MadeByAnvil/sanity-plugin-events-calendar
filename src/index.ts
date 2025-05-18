import {definePlugin} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import {schemaTypes} from './schemas'
import CalendarTool from './tools/CalendarTool'

interface CalendarPluginConfig {
  /* Configuration options can be added here */
}

/**
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
 */
export const calendarPlugin = definePlugin<CalendarPluginConfig | void>((config = {}) => {
  return {
    name: 'sanity-plugin-events-calendar',
    schema: {
      types: schemaTypes,
    },
    tools: [{
      name: 'calendar',
      title: 'Calendar',
      icon: CalendarIcon,
      component: CalendarTool,
    }],
  }
})

// Export schema types for direct usage
export {schemaTypes}
