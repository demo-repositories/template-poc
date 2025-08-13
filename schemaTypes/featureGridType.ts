import {defineField, defineType, defineArrayMember} from 'sanity'
import LockableObjectInput from '../components/LockableObjectInput'
import PageBuilderPreview from '../components/PageBuilderPreview'
import PageBuilderItem from '../components/PageBuilderItem'
import {SquareIcon} from '@sanity/icons'

export const featureGridType = defineType({
  name: 'featureGrid',
  title: 'Feature Grid',
  type: 'object',
  components: {input: LockableObjectInput, preview: PageBuilderPreview, item: PageBuilderItem},
  icon: SquareIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Section title (e.g., "Our Features")',
    }),
    defineField({
      name: 'subtitle',
      type: 'text',
      description: 'Optional subtitle or description',
    }),
    defineField({
      name: 'features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              validation: (rule) => rule.required().error('Feature title is required'),
            }),
            defineField({
              name: 'description',
              type: 'text',
              validation: (rule) => rule.required().error('Feature description is required'),
            }),
            defineField({
              name: 'icon',
              type: 'string',
              options: {
                list: [
                  {title: 'Star', value: 'star'},
                  {title: 'Heart', value: 'heart'},
                  {title: 'Check', value: 'check'},
                  {title: 'Lightning', value: 'lightning'},
                  {title: 'Shield', value: 'shield'},
                  {title: 'Gear', value: 'gear'},
                  {title: 'Globe', value: 'globe'},
                  {title: 'Rocket', value: 'rocket'},
                ],
                layout: 'radio',
              },
              initialValue: 'star',
            }),
            defineField({
              name: 'image',
              type: 'image',
              options: {
                hotspot: true,
              },
              description: 'Optional feature image (overrides icon)',
            }),
            defineField({
              name: 'link',
              type: 'url',
              description: 'Optional link for the feature',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
              icon: 'icon',
              media: 'image',
            },
            prepare({title, subtitle, icon, media}) {
              return {
                title: title || 'Feature',
                subtitle: subtitle?.length > 50 ? `${subtitle.substring(0, 50)}...` : subtitle,
                media: media || SquareIcon,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).error('At least one feature is required'),
    }),
    defineField({
      name: 'columns',
      type: 'string',
      options: {
        list: [
          {title: '2 Columns', value: '2'},
          {title: '3 Columns', value: '3'},
          {title: '4 Columns', value: '4'},
        ],
        layout: 'radio',
      },
      initialValue: '3',
    }),
    defineField({
      name: 'textAlignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    }),
    defineField({
      name: 'showIcons',
      type: 'string',
      options: {
        list: [
          {title: 'Show', value: 'show'},
          {title: 'Hide', value: 'hide'},
        ],
        layout: 'radio',
      },
      initialValue: 'show',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      features: 'features',
      _key: '_key',
    },
    prepare({title, features, _key}) {
      const featureCount = features?.length || 0
      return {
        title: title || 'Feature Grid',
        subtitle: `${featureCount} feature${featureCount !== 1 ? 's' : ''}`,
        media: SquareIcon,
        _key,
      }
    },
  },
})
