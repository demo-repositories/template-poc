import {defineField, defineType, defineArrayMember} from 'sanity'
import LockableObjectInput from '../components/LockableObjectInput'
import LockedItemPreview from '../components/PageBuilderPreview'
import PageBuilderItem from '../components/PageBuilderItem'
import {TextIcon} from '@sanity/icons'

export const textBlockType = defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  icon: TextIcon,
  components: {
    input: LockableObjectInput,
    preview: LockedItemPreview,
    item: PageBuilderItem,
  },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Optional heading for this text block',
    }),
    defineField({
      name: 'content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        }),
      ],
      validation: (rule) => rule.required().error('Text content is required'),
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
      initialValue: 'left',
    }),
    defineField({
      name: 'maxWidth',
      type: 'string',
      options: {
        list: [
          {title: 'Full Width', value: 'full'},
          {title: 'Narrow', value: 'narrow'},
          {title: 'Medium', value: 'medium'},
        ],
        layout: 'radio',
      },
      initialValue: 'full',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      content: 'content',
      _key: '_key',
    },
    prepare({title, content, _key}) {
      const textContent = content?.[0]?.children?.[0]?.text || 'No content'
      return {
        title: title || 'Text Block',
        subtitle: textContent.length > 50 ? `${textContent.substring(0, 50)}...` : textContent,
        _key,
      }
    },
  },
})
