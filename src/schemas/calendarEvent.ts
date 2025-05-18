import {Rule} from 'sanity'

export default {
  name: 'calendarEvent',
  title: 'Calendar Event',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: Rule) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      }
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'startDateTime',
      title: 'Start Date & Time',
      type: 'datetime',
      validation: (Rule: Rule) => Rule.required()
    },
    {
      name: 'endDateTime',
      title: 'End Date & Time',
      type: 'datetime'
    },
    {
      name: 'allDay',
      title: 'All Day Event',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        {name: 'name', type: 'string', title: 'Name'},
        {name: 'address', type: 'text', title: 'Address'},
        {name: 'coordinates', type: 'geopoint', title: 'Coordinates'}
      ]
    },
    {
      name: 'virtualEvent',
      title: 'Virtual Event',
      type: 'object',
      fields: [
        {name: 'isVirtual', type: 'boolean', title: 'Is Virtual'},
        {name: 'url', type: 'url', title: 'Event URL'},
        {name: 'meetingId', type: 'string', title: 'Meeting ID'}
      ]
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'eventCategory'}}]
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'image',
      title: 'Event Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'organizers',
      title: 'Organizers',
      type: 'array',
      of: [{type: 'reference', to: {type: 'person'}}]
    },
    {
      name: 'recurrence',
      title: 'Recurrence',
      type: 'object',
      fields: [
        {
          name: 'isRecurring',
          title: 'Is Recurring',
          type: 'boolean',
          initialValue: false
        },
        {
          name: 'frequency',
          title: 'Frequency',
          type: 'string',
          options: {
            list: [
              {title: 'Daily', value: 'daily'},
              {title: 'Weekly', value: 'weekly'},
              {title: 'Monthly', value: 'monthly'},
              {title: 'Yearly', value: 'yearly'}
            ]
          },
          hidden: ({parent}: {parent: Record<string, any>}) => !parent?.isRecurring
        },
        {
          name: 'interval',
          title: 'Interval',
          type: 'number',
          description: 'Repeat every X days/weeks/months/years',
          initialValue: 1,
          hidden: ({parent}: {parent: Record<string, any>}) => !parent?.isRecurring
        },
        {
          name: 'endDate',
          title: 'End Date',
          type: 'date',
          hidden: ({parent}: {parent: Record<string, any>}) => !parent?.isRecurring
        },
        {
          name: 'daysOfWeek',
          title: 'Days of Week',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: [
              {title: 'Monday', value: 'monday'},
              {title: 'Tuesday', value: 'tuesday'},
              {title: 'Wednesday', value: 'wednesday'},
              {title: 'Thursday', value: 'thursday'},
              {title: 'Friday', value: 'friday'},
              {title: 'Saturday', value: 'saturday'},
              {title: 'Sunday', value: 'sunday'}
            ]
          },
          hidden: ({parent}: {parent: Record<string, any>}) => !parent?.isRecurring || parent?.frequency !== 'weekly'
        }
      ]
    },
    {
      name: 'status',
      title: 'Event Status',
      type: 'string',
      options: {
        list: [
          {title: 'Scheduled', value: 'scheduled'},
          {title: 'Cancelled', value: 'cancelled'},
          {title: 'Postponed', value: 'postponed'},
          {title: 'Rescheduled', value: 'rescheduled'}
        ],
        layout: 'radio'
      },
      initialValue: 'scheduled'
    },
    {
      name: 'attendees',
      title: 'Attendees',
      type: 'object',
      fields: [
        {name: 'maxAttendees', type: 'number', title: 'Maximum Attendees'},
        {name: 'requiresRegistration', type: 'boolean', title: 'Requires Registration'}
      ]
    },
    {
      name: 'visibility',
      title: 'Visibility',
      type: 'string',
      options: {
        list: [
          {title: 'Public', value: 'public'},
          {title: 'Private', value: 'private'},
          {title: 'Draft', value: 'draft'}
        ]
      },
      initialValue: 'public'
    }
  ],
  preview: {
    select: {
      title: 'title',
      date: 'startDateTime',
      media: 'image'
    },
    prepare({title, date, media}: {title: string; date: string; media: any}) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString() : 'No date set',
        media
      }
    }
  }
}