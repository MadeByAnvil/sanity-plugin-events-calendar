/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  CalendarIcon,
  ClockIcon,
  CogIcon, // Used instead of SettingsIcon
  ComposeIcon,
  EarthGlobeIcon,
  ImagesIcon,
  ResetIcon, // Used instead of RepeatIcon
  TagIcon,
  UsersIcon,
} from '@sanity/icons'
import {Asset, Rule} from 'sanity'

import {Document, Parent} from '../types/calendar'

// Use correct icons as substitutes
const RepeatIcon = ResetIcon
const SettingsIcon = CogIcon

// Format status badge
const getStatusBadge = (statusValue: string) => {
  switch (statusValue) {
    case 'cancelled':
      return ' [CANCELLED]'
    case 'postponed':
      return ' [POSTPONED]'
    case 'rescheduled':
      return ' [RESCHEDULED]'
    default:
      return ''
  }
}

// Get description based on status
const getDescription = (statusValue: string) => {
  switch (statusValue) {
    case 'cancelled':
      return 'This event has been cancelled.'
    case 'postponed':
      return 'This event has been postponed.'
    default:
      return undefined
  }
}

export default {
  name: 'calendarEvent',
  title: 'Calendar Event',
  type: 'document',
  icon: CalendarIcon,
  fieldsets: [
    {
      name: 'basicInfo',
      title: 'Basic Information',
      options: {
        collapsible: true,
        collapsed: false,
        icon: ComposeIcon,
      },
    },
    {
      name: 'timing',
      title: 'Event Date & Time',
      options: {
        collapsible: true,
        collapsed: false,
        icon: ClockIcon,
      },
    },
    {
      name: 'location',
      title: 'Event Location',
      options: {
        collapsible: true,
        collapsed: false,
        icon: EarthGlobeIcon,
      },
    },
    {
      name: 'categories',
      title: 'Categories & Tags',
      options: {
        collapsible: true,
        collapsed: true,
        icon: TagIcon,
      },
    },
    {
      name: 'media',
      title: 'Media & Content',
      options: {
        collapsible: true,
        collapsed: true,
        icon: ImagesIcon,
      },
    },
    {
      name: 'recurrence',
      title: 'Recurrence Settings',
      options: {
        collapsible: true,
        collapsed: true,
        icon: RepeatIcon,
      },
    },
    {
      name: 'attendees',
      title: 'Attendees & Registration',
      options: {
        collapsible: true,
        collapsed: true,
        icon: UsersIcon,
      },
    },
    {
      name: 'settings',
      title: 'Event Settings',
      options: {
        collapsible: true,
        collapsed: true,
        icon: SettingsIcon,
      },
    },
  ],
  groups: [
    {
      name: 'details',
      title: 'Event Details',
      icon: ComposeIcon,
      default: true,
    },
    {
      name: 'scheduling',
      title: 'Scheduling',
      icon: ClockIcon,
    },
    {
      name: 'organization',
      title: 'Organization',
      icon: TagIcon,
    },
    {
      name: 'advanced',
      title: 'Advanced',
      icon: SettingsIcon,
    },
  ],
  fields: [
    // ---- Basic Information ----
    {
      name: 'title',
      title: 'Event Title',
      type: 'string',
      description: 'The name of your event',
      validation: (rule: Rule) => rule.required().min(3).max(100),
      fieldset: 'basicInfo',
      group: 'details',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'The URL-friendly identifier for this event',
      options: {
        source: 'title',
        maxLength: 96,
      },
      fieldset: 'basicInfo',
      group: 'details',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A detailed description of the event',
      rows: 5,
      fieldset: 'basicInfo',
      group: 'details',
    },
    {
      name: 'organizers',
      title: 'Organizers',
      type: 'array',
      description: 'Who is organizing this event?',
      of: [{type: 'reference', to: {type: 'person'}}],
      fieldset: 'basicInfo',
      group: 'organization',
    },

    // ---- Timing Information ----
    {
      name: 'startDateTime',
      title: 'Start Date & Time',
      type: 'datetime',
      description: 'When does the event start?',
      options: {
        dateFormat: 'MMMM DD, YYYY',
        timeFormat: 'h:mm A',
        timeStep: 15,
        calendarTodayLabel: 'Today',
      },
      validation: (rule: Rule) => rule.required(),
      fieldset: 'timing',
      group: 'scheduling',
    },
    {
      name: 'endDateTime',
      title: 'End Date & Time',
      type: 'datetime',
      description: 'When does the event end?',
      options: {
        dateFormat: 'MMMM DD, YYYY',
        timeFormat: 'h:mm A',
        timeStep: 15,
        calendarTodayLabel: 'Today',
      },
      validation: (rule: Rule) =>
        rule.min(rule.valueOfField('startDateTime')).warning('End time should be after start time'),
      fieldset: 'timing',
      group: 'scheduling',
    },
    {
      name: 'allDay',
      title: 'All Day Event',
      type: 'boolean',
      description: 'Is this an all-day event?',
      initialValue: false,
      fieldset: 'timing',
      group: 'scheduling',
    },
    {
      name: 'status',
      title: 'Event Status',
      type: 'string',
      description: 'What is the current status of this event?',
      options: {
        list: [
          {title: 'Scheduled', value: 'scheduled'},
          {title: 'Cancelled', value: 'cancelled'},
          {title: 'Postponed', value: 'postponed'},
          {title: 'Rescheduled', value: 'rescheduled'},
        ],
        layout: 'radio',
      },
      initialValue: 'scheduled',
      fieldset: 'timing',
      group: 'scheduling',
    },

    // ---- Location Information ----
    {
      name: 'locationType',
      title: 'Location Type',
      type: 'string',
      description: 'Select the type of event location',
      options: {
        list: [
          {
            title: 'Physical Location',
            value: 'physical',
          },
          {
            title: 'Virtual Event',
            value: 'virtual',
          },
          {
            title: 'Hybrid Event',
            value: 'hybrid',
          },
          {
            title: 'TBD',
            value: 'tbd',
          },
        ],
        layout: 'dropdown',
        direction: 'vertical',
      },
      fieldset: 'location',
      group: 'details',
      validation: (rule: Rule) => rule.required().error('Please select a location type'),
    },

    // Location type description field - using description instead of custom component
    {
      name: 'locationTypeDescription',
      title: ' ',
      type: 'string',
      // Without an actual component
      readOnly: true,
      description: 'Select a location type from the dropdown above to see additional options.',
      fieldset: 'location',
      group: 'details',
      hidden: ({parent}: {parent: Parent}) => !parent?.locationType,
    },

    // Physical Location fields
    {
      name: 'location',
      title: 'Physical Location',
      type: 'object',
      fieldsets: [
        {
          name: 'address',
          title: 'Address Details',
          options: {
            collapsible: true,
            collapsed: false,
          },
        },
      ],
      fields: [
        {
          name: 'name',
          type: 'string',
          title: 'Venue Name',
          description: 'Name of the venue or building',
        },
        {
          name: 'address',
          type: 'text',
          title: 'Street Address',
          description: 'Full address of the venue',
          fieldset: 'address',
        },
        {
          name: 'city',
          type: 'string',
          title: 'City',
          fieldset: 'address',
        },
        {
          name: 'state',
          type: 'string',
          title: 'State/Province',
          fieldset: 'address',
        },
        {
          name: 'zipCode',
          type: 'string',
          title: 'ZIP/Postal Code',
          fieldset: 'address',
        },
        {
          name: 'country',
          type: 'string',
          title: 'Country',
          fieldset: 'address',
        },
        {
          name: 'coordinates',
          type: 'geopoint',
          title: 'Map Coordinates',
          description: 'Add a map marker for the location',
        },
        {
          name: 'accessibilityInfo',
          type: 'text',
          title: 'Accessibility Information',
          description: 'Details about venue accessibility',
        },
        {
          name: 'parkingInfo',
          type: 'text',
          title: 'Parking Information',
          description: 'Details about parking options',
        },
      ],
      fieldset: 'location',
      group: 'details',
      hidden: ({parent}: {parent: Parent}) =>
        !parent?.locationType || !['physical', 'hybrid'].includes(parent.locationType),
    },

    // Virtual Event fields
    {
      name: 'virtualEvent',
      title: 'Virtual Event Details',
      type: 'object',
      fields: [
        {
          name: 'platform',
          type: 'string',
          title: 'Platform',
          description: 'Select the platform hosting this virtual event',
          options: {
            list: [
              {title: 'Zoom', value: 'zoom'},
              {title: 'Microsoft Teams', value: 'teams'},
              {title: 'Google Meet', value: 'meet'},
              {title: 'Webex', value: 'webex'},
              {title: 'GoToMeeting', value: 'gotomeeting'},
              {title: 'YouTube Live', value: 'youtube'},
              {title: 'Vimeo', value: 'vimeo'},
              {title: 'Other', value: 'other'},
            ],
            layout: 'dropdown',
          },
          validation: (rule: Rule) =>
            rule.custom((value, context) => {
              // Only required if virtual event and parent locationType is virtual or hybrid
              const doc = context.document as Document
              if (doc.locationType && ['virtual', 'hybrid'].includes(doc.locationType) && !value) {
                return 'Platform is required for virtual events'
              }
              return true
            }),
        },
        {
          name: 'platformOther',
          type: 'string',
          title: 'Other Platform',
          description: 'Specify the platform if not listed above',
          hidden: ({parent}: {parent: Parent}) => parent?.platform !== 'other',
        },
        {
          name: 'url',
          type: 'url',
          title: 'Event URL',
          description: 'Link to join the virtual event',
          validation: (rule: Rule) => rule.uri({scheme: ['http', 'https']}),
        },
        {
          name: 'meetingId',
          type: 'string',
          title: 'Meeting ID',
          description: 'Optional meeting ID',
        },
        {
          name: 'password',
          type: 'string',
          title: 'Password',
          description: 'Optional password to access the event',
        },
        {
          name: 'joinInstructions',
          type: 'text',
          title: 'Join Instructions',
          description: 'Step-by-step instructions for joining the event',
          rows: 3,
        },
        {
          name: 'additionalInfo',
          type: 'text',
          title: 'Additional Information',
          description: 'Any other details needed to join',
          rows: 2,
        },
      ],
      fieldset: 'location',
      group: 'details',
      hidden: ({parent}: {parent: Parent}) =>
        !parent?.locationType || !['virtual', 'hybrid'].includes(parent.locationType),
    },

    // ---- Categories & Tags ----
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      description: 'Assign this event to categories',
      of: [{type: 'reference', to: {type: 'eventCategory'}}],
      fieldset: 'categories',
      group: 'organization',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Add relevant tags for this event',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      fieldset: 'categories',
      group: 'organization',
    },

    // ---- Media & Content ----
    {
      name: 'image',
      title: 'Event Image',
      type: 'image',
      description: 'The main image for this event',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Important for accessibility and SEO',
          options: {
            isHighlighted: true,
          },
        },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
          options: {
            isHighlighted: true,
          },
        },
      ],
      fieldset: 'media',
      group: 'details',
    },
    {
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      description: 'Additional images for this event',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              options: {
                isHighlighted: true,
              },
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              options: {
                isHighlighted: true,
              },
            },
          ],
        },
      ],
      fieldset: 'media',
      group: 'details',
    },

    // ---- Recurrence Settings ----
    {
      name: 'isRecurring',
      title: 'Recurring Event',
      type: 'boolean',
      description: 'Does this event repeat on a schedule?',
      initialValue: false,
      fieldset: 'recurrence',
      group: 'scheduling',
    },

    // Only show recurrence explanation if recurrence is enabled - using description instead
    {
      name: 'recurrenceDescription',
      title: ' ',
      type: 'string',
      description:
        'Set up a recurring pattern for this event. You can specify how often it repeats and when the recurrence ends.',
      fieldset: 'recurrence',
      group: 'scheduling',
      hidden: ({parent}: {parent: Parent}) => !parent?.isRecurring,
    },

    {
      name: 'recurrenceSettings',
      title: 'Recurrence Pattern',
      type: 'object',
      description: 'Define how often this event repeats',
      fieldsets: [
        {
          name: 'frequencySettings',
          title: 'Frequency Settings',
          options: {
            collapsible: true,
            collapsed: false,
          },
        },
        {
          name: 'endSettings',
          title: 'End Settings',
          options: {
            collapsible: true,
            collapsed: false,
          },
        },
      ],
      fields: [
        {
          name: 'frequency',
          title: 'Frequency',
          type: 'string',
          description: 'How often does this event repeat?',
          options: {
            list: [
              {
                title: 'Daily',
                value: 'daily',
              },
              {
                title: 'Weekly',
                value: 'weekly',
              },
              {
                title: 'Monthly',
                value: 'monthly',
              },
              {
                title: 'Yearly',
                value: 'yearly',
              },
            ],
            layout: 'dropdown',
            direction: 'vertical',
          },
          validation: (rule: Rule) => rule.required().error('Please select a frequency'),
          fieldset: 'frequencySettings',
        },

        // Dynamic frequency description based on selection
        {
          name: 'frequencyDescription',
          title: ' ',
          type: 'string',
          description: 'Select a frequency from the dropdown above.',
          fieldset: 'frequencySettings',
          hidden: ({parent}: {parent: Parent}) => !parent?.frequency,
        },

        {
          name: 'interval',
          title: 'Interval',
          type: 'number',
          description: 'Repeat every X days/weeks/months/years',
          initialValue: 1,
          validation: (rule: Rule) => rule.min(1).integer().required(),
          fieldset: 'frequencySettings',
        },

        {
          name: 'daysOfWeek',
          title: 'Days of Week',
          type: 'array',
          description: 'Which days of the week does this event occur?',
          of: [{type: 'string'}],
          options: {
            list: [
              {title: 'Monday', value: 'monday'},
              {title: 'Tuesday', value: 'tuesday'},
              {title: 'Wednesday', value: 'wednesday'},
              {title: 'Thursday', value: 'thursday'},
              {title: 'Friday', value: 'friday'},
              {title: 'Saturday', value: 'saturday'},
              {title: 'Sunday', value: 'sunday'},
            ],
            layout: 'grid',
          },
          validation: (rule: Rule) =>
            rule.custom((value: string[] | undefined, context) => {
              const parent = context.parent as Parent
              if (parent?.frequency === 'weekly' && (!value || value.length === 0)) {
                return 'Please select at least one day of the week'
              }
              return true
            }),
          fieldset: 'frequencySettings',
          hidden: ({parent}: {parent: Parent}) => parent?.frequency !== 'weekly',
        },

        {
          name: 'endType',
          title: 'Ends',
          type: 'string',
          description: 'When does this recurring event end?',
          options: {
            list: [
              {title: 'Never', value: 'never'},
              {title: 'On Date', value: 'onDate'},
              {title: 'After Occurrences', value: 'afterOccurrences'},
            ],
            layout: 'radio',
          },
          initialValue: 'never',
          fieldset: 'endSettings',
        },

        {
          name: 'endDate',
          title: 'End Date',
          type: 'date',
          description: 'Last date this event will occur',
          options: {
            dateFormat: 'MMMM DD, YYYY',
          },
          validation: (rule: Rule) => rule.required().error('End date is required'),
          fieldset: 'endSettings',
          hidden: ({parent}: {parent: Parent}) => parent?.endType !== 'onDate',
        },

        {
          name: 'occurrences',
          title: 'Number of Occurrences',
          type: 'number',
          description: 'How many times will this event occur?',
          validation: (rule: Rule) =>
            rule.required().min(1).integer().error('Please enter a valid number of occurrences'),
          fieldset: 'endSettings',
          hidden: ({parent}: {parent: Parent}) => parent?.endType !== 'afterOccurrences',
        },
      ],
      hidden: ({document}: {document: Document}) => !document?.isRecurring,
      fieldset: 'recurrence',
      group: 'scheduling',
    },

    // ---- Attendees & Registration ----
    {
      name: 'requiresRegistration',
      title: 'Registration Required',
      type: 'boolean',
      description: 'Do attendees need to register for this event?',
      initialValue: false,
      fieldset: 'attendees',
      group: 'advanced',
    },
    {
      name: 'attendeeSettings',
      title: 'Attendee Settings',
      type: 'object',
      description: 'Configure registration and attendee settings',
      fields: [
        {
          name: 'maxAttendees',
          title: 'Maximum Attendees',
          type: 'number',
          description: 'Maximum number of attendees (leave empty for unlimited)',
          validation: (rule: Rule) => rule.positive().integer(),
        },
        {
          name: 'registrationUrl',
          title: 'Registration URL',
          type: 'url',
          description: 'Link to the registration form or page',
        },
        {
          name: 'registrationDeadline',
          title: 'Registration Deadline',
          type: 'datetime',
          description: 'Last date and time to register',
          options: {
            dateFormat: 'MMMM DD, YYYY',
            timeFormat: 'h:mm A',
          },
        },
        {
          name: 'registrationNotes',
          title: 'Registration Notes',
          type: 'text',
          description: 'Additional information about registration',
        },
      ],
      hidden: ({document}: {document: Document}) => !document?.requiresRegistration,
      fieldset: 'attendees',
      group: 'advanced',
    },

    // ---- Event Settings ----
    {
      name: 'visibility',
      title: 'Visibility',
      type: 'string',
      description: 'Who can view this event?',
      options: {
        list: [
          {title: 'Public', value: 'public'},
          {title: 'Private', value: 'private'},
          {title: 'Draft', value: 'draft'},
        ],
        layout: 'radio',
      },
      initialValue: 'public',
      fieldset: 'settings',
      group: 'advanced',
    },
    {
      name: 'featured',
      title: 'Featured Event',
      type: 'boolean',
      description: 'Mark this as a featured event',
      initialValue: false,
      fieldset: 'settings',
      group: 'advanced',
    },
  ],
  preview: {
    select: {
      title: 'title',
      startDate: 'startDateTime',
      status: 'status',
      // Location fields
      locationType: 'locationType',
      venueName: 'location.name',
      venueCity: 'location.city',
      venueState: 'location.state',
      // Virtual fields
      virtualPlatform: 'virtualEvent.platform',
      virtualPlatformOther: 'virtualEvent.platformOther',
      // Featured flag and image
      featured: 'featured',
      media: 'image',
    },
    prepare({
      title,
      startDate,
      status,
      locationType,
      venueName,
      venueCity,
      venueState,
      virtualPlatform,
      virtualPlatformOther,
      featured,
      media,
    }: {
      title: string
      startDate: string
      status: string
      locationType: string
      venueName: string
      venueCity: string
      venueState: string
      virtualPlatform: string
      virtualPlatformOther: string
      featured: boolean
      media: Asset
    }) {
      // Format date nicely
      const date = startDate
        ? new Date(startDate).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'No date set'

      // Format location based on type and available data
      let locationText = ''
      if (locationType === 'physical') {
        const venue = [venueName, venueCity, venueState].filter(Boolean).join(', ')
        locationText = venue ? ` @ ${venue}` : ''
      } else if (locationType === 'virtual') {
        const platform = virtualPlatform === 'other' ? virtualPlatformOther : virtualPlatform
        locationText = platform ? ` [${platform}]` : ' [Virtual]'
      } else if (locationType === 'hybrid') {
        const venue = venueName || ''
        locationText = venue ? ` [Hybrid @ ${venue}]` : ' [Hybrid]'
      } else if (locationType === 'tbd') {
        locationText = ' [Location TBD]'
      }

      const statusBadge = getStatusBadge(status)
      const description = getDescription(status)

      // Combine date, location, and status for subtitle
      const subtitle = `${date}${locationText}${statusBadge}`

      // Return formatted preview
      return {
        title: featured ? `★ ${title}` : title,
        subtitle: subtitle,
        media: media || CalendarIcon,
        description: description,
      }
    },
  },
  orderings: [
    {
      title: 'Start Date, New to Old',
      name: 'startDateDesc',
      by: [{field: 'startDateTime', direction: 'desc'}],
    },
    {
      title: 'Start Date, Old to New',
      name: 'startDateAsc',
      by: [{field: 'startDateTime', direction: 'asc'}],
    },
    {
      title: 'Title, A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
}
