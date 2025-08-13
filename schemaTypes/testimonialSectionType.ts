import {defineField, defineType, defineArrayMember} from 'sanity'
import LockableObjectInput from '../components/LockableObjectInput'
import PageBuilderPreview from '../components/PageBuilderPreview'
import PageBuilderItem from '../components/PageBuilderItem'
import {CommentIcon} from '@sanity/icons'

export const testimonialSectionType = defineType({
  name: 'testimonialSection',
  title: 'Testimonial Section',
  type: 'object',
  components: {input: LockableObjectInput, preview: PageBuilderPreview, item: PageBuilderItem},
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Section title (e.g., "What Our Customers Say")',
    }),
    defineField({
      name: 'testimonials',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'quote',
              type: 'text',
              validation: (rule) => rule.required().error('Testimonial quote is required'),
            }),
            defineField({
              name: 'author',
              type: 'string',
              validation: (rule) => rule.required().error('Author name is required'),
            }),
            defineField({
              name: 'authorTitle',
              type: 'string',
              description: 'Author job title or company',
            }),
            defineField({
              name: 'authorImage',
              type: 'image',
              options: {
                hotspot: true,
              },
              description: 'Optional author photo',
            }),
            defineField({
              name: 'rating',
              type: 'number',
              description: 'Star rating (1-5)',
              validation: (rule) => rule.min(1).max(5).integer(),
            }),
          ],
          preview: {
            select: {
              title: 'author',
              subtitle: 'quote',
              media: 'authorImage',
            },
            prepare({title, subtitle, media}) {
              return {
                title: title || 'Testimonial',
                subtitle: subtitle?.length > 50 ? `${subtitle.substring(0, 50)}...` : subtitle,
                media: media,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).error('At least one testimonial is required'),
    }),
    defineField({
      name: 'layout',
      type: 'string',
      options: {
        list: [
          {title: 'Grid (2 columns)', value: 'grid-2'},
          {title: 'Grid (3 columns)', value: 'grid-3'},
          {title: 'Carousel', value: 'carousel'},
          {title: 'List', value: 'list'},
        ],
        layout: 'radio',
      },
      initialValue: 'grid-3',
    }),
    defineField({
      name: 'showRatings',
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
      testimonials: 'testimonials',
      _key: '_key',
    },
    prepare({title, testimonials, _key}) {
      const testimonialCount = testimonials?.length || 0
      return {
        title: title || 'Testimonial Section',
        subtitle: `${testimonialCount} testimonial${testimonialCount !== 1 ? 's' : ''}`,
        _key,
      }
    },
  },
})
