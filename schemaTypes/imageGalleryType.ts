import {defineField, defineType, defineArrayMember} from 'sanity'
import LockableObjectInput from '../components/LockableObjectInput'
import PageBuilderPreview from '../components/PageBuilderPreview'
import PageBuilderItem from '../components/PageBuilderItem'
import {ImagesIcon} from '@sanity/icons'

export const imageGalleryType = defineType({
  name: 'imageGallery',
  title: 'Image Gallery',
  type: 'object',
  components: {input: LockableObjectInput, preview: PageBuilderPreview, item: PageBuilderItem},
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Optional gallery title',
    }),
    defineField({
      name: 'images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              options: {
                hotspot: true,
              },
              description: 'Optional image',
            }),
            defineField({
              name: 'caption',
              type: 'string',
              description: 'Optional image caption',
            }),
            defineField({
              name: 'alt',
              type: 'string',
              description: 'Alt text for accessibility',
            }),
          ],
          preview: {
            select: {
              media: 'image',
              title: 'caption',
              subtitle: 'alt',
            },
            prepare({media, title, subtitle}) {
              return {
                title: title || 'Image',
                subtitle: subtitle,
                media: media,
              }
            },
          },
        }),
      ],
      description: 'Optional images for the gallery',
    }),
    defineField({
      name: 'layout',
      type: 'string',
      options: {
        list: [
          {title: 'Grid (2 columns)', value: 'grid-2'},
          {title: 'Grid (3 columns)', value: 'grid-3'},
          {title: 'Grid (4 columns)', value: 'grid-4'},
          {title: 'Masonry', value: 'masonry'},
          {title: 'Carousel', value: 'carousel'},
        ],
        layout: 'radio',
      },
      initialValue: 'grid-3',
    }),
    defineField({
      name: 'showCaptions',
      type: 'string',
      options: {
        list: [
          {title: 'Always', value: 'always'},
          {title: 'On Hover', value: 'hover'},
          {title: 'Never', value: 'never'},
        ],
        layout: 'radio',
      },
      initialValue: 'hover',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      images: 'images',
      _key: '_key',
    },
    prepare({title, images, _key}) {
      const imageCount = images?.length || 0
      return {
        title: title || 'Image Gallery',
        subtitle: `${imageCount} image${imageCount !== 1 ? 's' : ''}`,
        media: images?.[0]?.image,
        _key,
      }
    },
  },
})
