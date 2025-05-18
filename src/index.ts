import {definePlugin} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import {schemaTypes} from './schemas'
import CalendarTool from './tools/CalendarTool'

// Note: CSS is extracted to a separate file
// that can be imported by the user when using this plugin:
// import 'sanity-plugin-events-calendar/styles.css'

interface CalendarPluginConfig {
  /* Configuration options can be added here */
}

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
/**
 * Schema types exported by the calendar plugin
 * @public
 */
export {schemaTypes}
