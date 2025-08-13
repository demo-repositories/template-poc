import {defineField, defineType} from 'sanity'
import TemplateReferenceInput from '../components/TemplateReferenceInput'
import {DocumentIcon} from '@sanity/icons'

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().error('Page title is required'),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('Page slug is required'),
    }),
    defineField({
      name: 'template',
      title: 'Template',
      type: 'reference',
      group: 'content',
      to: [{type: 'pageTemplate'}],
      options: {disableNew: true, filter: 'isActive == "active"'},
      components: {input: TemplateReferenceInput},
    }),
    defineField({
      name: 'pageBuilder',
      type: 'pageBuilder',
      group: 'content',
    }),
    // Internal field used to lock template-derived items by key
    defineField({
      name: 'templateLockedKeys',
      type: 'array',
      of: [{type: 'string'}],
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'metaDescription',
      type: 'text',
      group: 'seo',
      description: 'Brief description for search engines',
      validation: (rule) => rule.max(160).warning('Should be under 160 characters'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({title, slug}) {
      return {
        title: title || 'Untitled Page',
        subtitle: `${slug ? `/${slug}` : 'No slug'}`,
      }
    },
  },
})
