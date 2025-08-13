import {defineType, defineArrayMember} from 'sanity'

export const pageBuilderType = defineType({
  name: 'pageBuilder',
  title: 'Page Builder',
  type: 'array',
  description: 'Build your page using different content blocks',
  of: [
    defineArrayMember({type: 'heroSection'}),
    defineArrayMember({type: 'textBlock'}),
    defineArrayMember({type: 'imageGallery'}),
    defineArrayMember({type: 'testimonialSection'}),
    defineArrayMember({type: 'ctaSection'}),
    defineArrayMember({type: 'featureGrid'}),
  ],
})
