/* eslint-disable max-nested-callbacks */
import {describe, expect, it} from '@jest/globals'
import {Rule} from 'sanity'

import calendarEvent from '../../schemas/calendarEvent'
import {Document, Parent} from '../../types/calendar'

type Context = {
  parent?: Parent
  document?: Document
}

type ReferenceType = {
  type: string
  to: {type: string}
}

type Field = {
  name: string
  title: string
  type: string
  description?: string
  validation?: (rule: Rule) => Rule
  hidden?: (context: Context) => boolean
  fields?: Field[]
  fieldset?: string
  group?: string
  options?: Record<string, unknown>
  readOnly?: boolean
  rows?: number
  of?: (Field | ReferenceType)[]
}

type Group = {
  name: string
  title: string
  default?: boolean
}

// Helper function to find a field by name
const findField = (fields: Field[], name: string): Field | undefined => {
  return fields.find((f: Field) => f.name === name)
}

describe('calendarEvent schema', () => {
  it('should have the correct name', () => {
    expect(calendarEvent.name).toBe('calendarEvent')
  })

  it('should have the correct title', () => {
    expect(calendarEvent.title).toBe('Calendar Event')
  })

  it('should have the correct type', () => {
    expect(calendarEvent.type).toBe('document')
  })

  it('should have the correct groups', () => {
    // Test that groups is an array with the expected group names
    expect(calendarEvent.groups).toBeInstanceOf(Array)
    expect(calendarEvent.groups.length).toBe(4)

    // Check group names
    const groupNames = calendarEvent.groups.map((g: Group) => g.name)
    expect(groupNames).toContain('details')
    expect(groupNames).toContain('scheduling')
    expect(groupNames).toContain('organization')
    expect(groupNames).toContain('advanced')
  })

  it('should have the correct fields', () => {
    expect(calendarEvent.fields).toBeDefined()
    expect(Array.isArray(calendarEvent.fields)).toBe(true)
  })

  it('should have a title field', () => {
    const titleField = findField(calendarEvent.fields as Field[], 'title')
    expect(titleField).toBeDefined()
    expect(titleField?.type).toBe('string')
    expect(titleField?.validation).toBeDefined()
  })

  it('should have a slug field', () => {
    const slugField = findField(calendarEvent.fields as Field[], 'slug')
    expect(slugField).toBeDefined()
    expect(slugField?.type).toBe('slug')
    expect(slugField?.validation).toBeDefined()
  })

  it('should have a startDateTime field', () => {
    const startDateTimeField = findField(calendarEvent.fields as Field[], 'startDateTime')
    expect(startDateTimeField).toBeDefined()
    expect(startDateTimeField?.type).toBe('datetime')
    expect(startDateTimeField?.validation).toBeDefined()
  })

  it('should have an endDateTime field', () => {
    const endDateTimeField = findField(calendarEvent.fields as Field[], 'endDateTime')
    expect(endDateTimeField).toBeDefined()
    expect(endDateTimeField?.type).toBe('datetime')
    expect(endDateTimeField?.validation).toBeDefined()
  })

  it('should have a locationType field', () => {
    const locationTypeField = findField(calendarEvent.fields as Field[], 'locationType')
    expect(locationTypeField).toBeDefined()
    expect(locationTypeField?.type).toBe('string')
    expect(locationTypeField?.validation).toBeDefined()
  })

  it('should have a location field', () => {
    const locationField = findField(calendarEvent.fields as Field[], 'location')
    expect(locationField).toBeDefined()
    expect(locationField?.type).toBe('object')
    expect(locationField?.hidden).toBeDefined()
  })

  it('should hide location field when locationType is not physical or hybrid', () => {
    const locationField = findField(calendarEvent.fields as Field[], 'location')
    expect(locationField?.hidden?.({parent: {locationType: 'virtual'}})).toBe(true)
    expect(locationField?.hidden?.({parent: {locationType: 'physical'}})).toBe(false)
    expect(locationField?.hidden?.({parent: {locationType: 'hybrid'}})).toBe(false)
  })

  it('should have a virtualEvent field', () => {
    const virtualEventField = findField(calendarEvent.fields as Field[], 'virtualEvent')
    expect(virtualEventField).toBeDefined()
    expect(virtualEventField?.type).toBe('object')
    expect(virtualEventField?.hidden).toBeDefined()
  })

  it('should have a platform field inside virtualEvent', () => {
    const virtualEventField = findField(calendarEvent.fields as Field[], 'virtualEvent') as Field
    const platformField = virtualEventField.fields?.find((f) => f.name === 'platform')
    expect(platformField).toBeDefined()
    expect(platformField?.type).toBe('string')
  })

  it('should hide virtualEvent field when locationType is not virtual or hybrid', () => {
    const virtualEventField = findField(calendarEvent.fields as Field[], 'virtualEvent')
    expect(virtualEventField?.hidden?.({parent: {locationType: 'physical'}})).toBe(true)
    expect(virtualEventField?.hidden?.({parent: {locationType: 'virtual'}})).toBe(false)
    expect(virtualEventField?.hidden?.({parent: {locationType: 'hybrid'}})).toBe(false)
  })

  it('should have a isRecurring field', () => {
    const isRecurringField = findField(calendarEvent.fields as Field[], 'isRecurring')
    expect(isRecurringField).toBeDefined()
    expect(isRecurringField?.type).toBe('boolean')
  })

  it('should have a recurrenceSettings field', () => {
    const recurrenceSettingsField = findField(calendarEvent.fields as Field[], 'recurrenceSettings')
    expect(recurrenceSettingsField).toBeDefined()
    expect(recurrenceSettingsField?.type).toBe('object')
    expect(recurrenceSettingsField?.hidden).toBeDefined()
  })

  it('should hide recurrenceSettings field when isRecurring is false', () => {
    const recurrenceSettingsField = findField(calendarEvent.fields as Field[], 'recurrenceSettings')
    const hiddenFn = recurrenceSettingsField?.hidden

    if (hiddenFn) {
      expect(hiddenFn({document: {isRecurring: false}})).toBe(true)
      expect(hiddenFn({document: {isRecurring: true}})).toBe(false)
    } else {
      expect(hiddenFn).toBeTruthy()
    }
  })

  it('should have a frequency field inside recurrenceSettings', () => {
    const recurrenceSettingsField = findField(
      calendarEvent.fields as Field[],
      'recurrenceSettings',
    ) as Field
    const frequencyField = recurrenceSettingsField.fields?.find((f) => f.name === 'frequency')
    expect(frequencyField).toBeDefined()
    expect(frequencyField?.type).toBe('string')
  })

  it('should have an endType field inside recurrenceSettings', () => {
    const recurrenceSettingsField = findField(
      calendarEvent.fields as Field[],
      'recurrenceSettings',
    ) as Field
    const endTypeField = recurrenceSettingsField.fields?.find((f) => f.name === 'endType')
    expect(endTypeField).toBeDefined()
    expect(endTypeField?.type).toBe('string')
  })

  it('should have a requiresRegistration field', () => {
    const requiresRegistrationField = findField(
      calendarEvent.fields as Field[],
      'requiresRegistration',
    )
    expect(requiresRegistrationField).toBeDefined()
    expect(requiresRegistrationField?.type).toBe('boolean')
  })

  it('should have an attendeeSettings field', () => {
    const attendeeSettingsField = findField(calendarEvent.fields as Field[], 'attendeeSettings')
    expect(attendeeSettingsField).toBeDefined()
    expect(attendeeSettingsField?.type).toBe('object')
    expect(attendeeSettingsField?.hidden).toBeDefined()
  })

  it('should hide attendeeSettings field when requiresRegistration is false', () => {
    const attendeeSettingsField = findField(calendarEvent.fields as Field[], 'attendeeSettings')
    const hiddenFn = attendeeSettingsField?.hidden

    if (hiddenFn) {
      expect(hiddenFn({document: {requiresRegistration: false}})).toBe(true)
      expect(hiddenFn({document: {requiresRegistration: true}})).toBe(false)
    } else {
      expect(hiddenFn).toBeTruthy()
    }
  })

  it('should have a registrationUrl field inside attendeeSettings', () => {
    const attendeeSettingsField = findField(
      calendarEvent.fields as Field[],
      'attendeeSettings',
    ) as Field
    const registrationUrlField = attendeeSettingsField.fields?.find(
      (f) => f.name === 'registrationUrl',
    )
    expect(registrationUrlField).toBeDefined()
    expect(registrationUrlField?.type).toBe('url')
  })

  it('should have a description field', () => {
    const descriptionField = findField(calendarEvent.fields as Field[], 'description')
    expect(descriptionField).toBeDefined()
    expect(descriptionField?.type).toBe('text')
  })

  it('should have an image field', () => {
    const imageField = findField(calendarEvent.fields as Field[], 'image')
    expect(imageField).toBeDefined()
    expect(imageField?.type).toBe('image')
  })

  it('should have a categories field', () => {
    const categoriesField = findField(calendarEvent.fields as Field[], 'categories')
    expect(categoriesField).toBeDefined()
    expect(categoriesField?.type).toBe('array')
    expect(categoriesField?.of).toBeDefined()
  })

  it('should have a status field', () => {
    const statusField = findField(calendarEvent.fields as Field[], 'status')
    expect(statusField).toBeDefined()
    expect(statusField?.type).toBe('string')
  })

  it('should have a visibility field', () => {
    const visibilityField = findField(calendarEvent.fields as Field[], 'visibility')
    expect(visibilityField).toBeDefined()
    expect(visibilityField?.type).toBe('string')
  })
})
