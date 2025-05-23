/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {TagIcon} from '@sanity/icons'
import {Asset, Rule} from 'sanity'

export default {
  name: 'eventCategory',
  title: 'Event Category',
  type: 'document',
  icon: TagIcon,
  fieldsets: [
    {
      name: 'appearance',
      title: 'Appearance',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
  ],
  fields: [
    {
      name: 'title',
      title: 'Category Name',
      type: 'string',
      description: 'Name of this event category',
      validation: (rule: Rule) => rule.required().min(2).max(50),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier for this category',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of this category',
      rows: 3,
    },
    {
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Color code for this category (hex, rgb, etc.)',
      fieldset: 'appearance',
      validation: (rule: Rule) =>
        rule
          .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
            name: 'hex color',
            invert: false,
          })
          .warning('Should be a valid hex color (e.g. #FF0000)'),
    },
    {
      name: 'colorName',
      title: 'Color Name',
      type: 'string',
      description: 'A user-friendly name for this color (e.g. "Blue")',
      fieldset: 'appearance',
    },
    {
      name: 'icon',
      title: 'Category Icon',
      type: 'image',
      description: 'An icon representing this category',
      options: {
        hotspot: true,
      },
      fieldset: 'appearance',
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          options: {
            isHighlighted: true,
          },
        },
      ],
    },
    {
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this category appears in lists (lower numbers first)',
      validation: (rule: Rule) => rule.integer(),
    },
    {
      name: 'featured',
      title: 'Featured Category',
      type: 'boolean',
      description: 'Mark this category as featured',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'icon',
      color: 'color',
    },
    prepare({
      title,
      subtitle,
      media,
      color,
    }: {
      title: string
      subtitle?: string
      media?: Asset
      color?: string
    }) {
      const formatSubtitle = (text?: string) => {
        if (!text) return ''
        return text.length > 50 ? `${text.substring(0, 50)}...` : text
      }

      return {
        title: title,
        subtitle: formatSubtitle(subtitle),
        media: media || TagIcon,
        description: color ? `Color: ${color}` : undefined,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{field: 'displayOrder', direction: 'asc'}],
    },
    {
      title: 'Title, A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
}
