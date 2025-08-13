import {defineField, defineType} from 'sanity'
import LockableObjectInput from '../components/LockableObjectInput'
import PageBuilderPreview from '../components/PageBuilderPreview'
import {StarIcon} from '@sanity/icons'
import PageBuilderItem from '../components/PageBuilderItem'

export const heroSectionType = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  icon: StarIcon,
  components: {
    input: LockableObjectInput,
    preview: PageBuilderPreview,
    item: PageBuilderItem,
  },
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional hero image',
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required().error('Hero title is required'),
    }),
    defineField({
      name: 'subtitle',
      type: 'text',
      description: 'Optional subtitle text',
    }),
    defineField({
      name: 'ctaText',
      type: 'string',
      description: 'Call-to-action button text',
    }),
    defineField({
      name: 'ctaLink',
      type: 'url',
      description: 'Where the CTA button should link to',
    }),
    defineField({
      name: 'alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'image',
      _key: '_key',
    },
    prepare({title, subtitle, media, _key}) {
      return {
        title: title || 'Hero Section',
        subtitle: subtitle,
        media: media,
        _key,
      }
    },
  },
})
