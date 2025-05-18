import {Rule} from 'sanity'
import {UserIcon} from '@sanity/icons'

export default {
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: UserIcon,
  fieldsets: [
    {
      name: 'contact',
      title: 'Contact Information',
      options: {
        collapsible: true,
        collapsed: false
      }
    },
    {
      name: 'profile',
      title: 'Profile & Bio',
      options: {
        collapsible: true,
        collapsed: false
      }
    }
  ],
  groups: [
    {
      name: 'identity',
      title: 'Identity',
      default: true
    },
    {
      name: 'contact',
      title: 'Contact'
    },
    {
      name: 'details',
      title: 'Details'
    }
  ],
  fields: [
    // Basic Identity Fields
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
      description: 'Full name of the person',
      validation: (Rule: Rule) => Rule.required().min(2),
      group: 'identity'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: (Rule: Rule) => Rule.required(),
      group: 'identity'
    },
    {
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      description: 'Photo of this person',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Important for accessibility',
          options: {
            isHighlighted: true
          }
        }
      ],
      group: 'identity'
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Primary role or job title',
      group: 'identity'
    },
    {
      name: 'organization',
      title: 'Organization',
      type: 'string',
      description: 'Company or organization name',
      group: 'identity'
    },

    // Contact Information Fields
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      description: 'Primary email contact',
      validation: (Rule: Rule) => Rule.regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        {
          name: 'email',
          invert: false
        }
      ).warning('Please enter a valid email address'),
      fieldset: 'contact',
      group: 'contact'
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Primary phone contact',
      fieldset: 'contact',
      group: 'contact'
    },
    {
      name: 'website',
      title: 'Website',
      type: 'url',
      description: 'Personal or professional website',
      validation: (Rule: Rule) => Rule.uri({
        scheme: ['http', 'https']
      }),
      fieldset: 'contact',
      group: 'contact'
    },
    {
      name: 'socialMedia',
      title: 'Social Media',
      type: 'object',
      description: 'Social media profiles',
      fields: [
        {name: 'twitter', type: 'string', title: 'Twitter/X', description: 'Twitter/X handle'},
        {name: 'linkedin', type: 'url', title: 'LinkedIn', description: 'LinkedIn profile URL'},
        {name: 'instagram', type: 'string', title: 'Instagram', description: 'Instagram handle'},
        {name: 'facebook', type: 'url', title: 'Facebook', description: 'Facebook profile URL'}
      ],
      options: {
        collapsible: true,
        collapsed: true
      },
      fieldset: 'contact',
      group: 'contact'
    },

    // Profile & Bio Fields
    {
      name: 'shortBio',
      title: 'Short Bio',
      type: 'text',
      description: 'Brief biography (1-2 sentences)',
      rows: 2,
      validation: (Rule: Rule) => Rule.max(200),
      fieldset: 'profile',
      group: 'details'
    },
    {
      name: 'fullBio',
      title: 'Full Biography',
      type: 'text',
      description: 'Detailed biography',
      rows: 5,
      fieldset: 'profile',
      group: 'details'
    },
    {
      name: 'expertise',
      title: 'Areas of Expertise',
      type: 'array',
      description: 'Fields of expertise or specialization',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      },
      fieldset: 'profile',
      group: 'details'
    },
    {
      name: 'isOrganizer',
      title: 'Event Organizer',
      type: 'boolean',
      description: 'This person can be assigned as an event organizer',
      initialValue: false,
      group: 'details'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      org: 'organization',
      media: 'image'
    },
    prepare({title, subtitle, org, media}: {
      title: string;
      subtitle?: string;
      org?: string;
      media?: any;
    }) {
      return {
        title: title,
        subtitle: [subtitle, org].filter(Boolean).join(' • '),
        media: media || UserIcon
      }
    }
  },
  orderings: [
    {
      title: 'Name, A-Z',
      name: 'nameAsc',
      by: [
        {field: 'name', direction: 'asc'}
      ]
    },
    {
      title: 'Role',
      name: 'roleDesc',
      by: [
        {field: 'role', direction: 'asc'},
        {field: 'name', direction: 'asc'}
      ]
    }
  ]
}