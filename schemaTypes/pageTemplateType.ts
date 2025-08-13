import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const pageTemplateType = defineType({
  name: 'pageTemplate',
  title: 'Page Template',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'settings',
      title: 'Template Settings',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().error('Template title is required'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      group: 'content',
      description: 'Brief description of what this template is for',
    }),
    defineField({
      name: 'pageBuilder',
      type: 'pageBuilder',
      group: 'content',
    }),
    defineField({
      name: 'category',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          {title: 'Landing Page', value: 'landing'},
          {title: 'Content Page', value: 'content'},
          {title: 'Product Page', value: 'product'},
          {title: 'Contact Page', value: 'contact'},
          {title: 'About Page', value: 'about'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required().error('Template category is required'),
    }),
    defineField({
      name: 'isActive',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Draft', value: 'draft'},
          {title: 'Archived', value: 'archived'},
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      isActive: 'isActive',
    },
    prepare({title, category, isActive}) {
      return {
        title: title || 'Untitled Template',
        subtitle: `${category || 'No category'} • ${isActive || 'draft'}`,
      }
    },
  },
})
