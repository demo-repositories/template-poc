import {defineField, defineType, defineArrayMember} from 'sanity'
import LockableObjectInput from '../components/LockableObjectInput'
import PageBuilderPreview from '../components/PageBuilderPreview'
import {BellIcon} from '@sanity/icons'
import PageBuilderItem from '../components/PageBuilderItem'

export const ctaSectionType = defineType({
  name: 'ctaSection',
  title: 'Call to Action Section',
  type: 'object',
  components: {input: LockableObjectInput, preview: PageBuilderPreview, item: PageBuilderItem},
  icon: BellIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required().error('CTA title is required'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      description: 'Supporting text to encourage action',
    }),
    defineField({
      name: 'backgroundImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional background image',
    }),
    defineField({
      name: 'backgroundColor',
      type: 'string',
      options: {
        list: [
          {title: 'Primary', value: 'primary'},
          {title: 'Secondary', value: 'secondary'},
          {title: 'Dark', value: 'dark'},
          {title: 'Light', value: 'light'},
          {title: 'Accent', value: 'accent'},
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'buttons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              type: 'string',
              validation: (rule) => rule.required().error('Button text is required'),
            }),
            defineField({
              name: 'link',
              type: 'url',
              validation: (rule) => rule.required().error('Button link is required'),
            }),
            defineField({
              name: 'style',
              type: 'string',
              options: {
                list: [
                  {title: 'Primary', value: 'primary'},
                  {title: 'Secondary', value: 'secondary'},
                  {title: 'Outline', value: 'outline'},
                ],
                layout: 'radio',
              },
              initialValue: 'primary',
            }),
            defineField({
              name: 'openInNewTab',
              type: 'string',
              options: {
                list: [
                  {title: 'Same Tab', value: 'same'},
                  {title: 'New Tab', value: 'new'},
                ],
                layout: 'radio',
              },
              initialValue: 'same',
            }),
          ],
          preview: {
            select: {
              title: 'text',
              subtitle: 'link',
            },
            prepare({title, subtitle}) {
              return {
                title: title || 'Button',
                subtitle: subtitle,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).error('At least one button is required'),
    }),
    defineField({
      name: 'textAlignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      buttons: 'buttons',
      _key: '_key',
    },
    prepare({title, description, _key}) {
      return {
        title: title || 'Call to Action',
        subtitle: description?.length > 50 ? `${description.substring(0, 50)}...` : description,
        media: BellIcon,
        _key,
      }
    },
  },
})
