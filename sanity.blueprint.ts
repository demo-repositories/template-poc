import {defineBlueprint, defineDocumentFunction} from '@sanity/blueprints'

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'template-handler',
      event: {
        on: ['publish'],
        filter: '_type == "pageTemplate" && delta::changedAny(pageBuilder)',
        // filter: '_type == "pageTemplate"', // for local dev
        projection:
          '{_id, "lastPageBuilder": before().pageBuilder, "pageBuilder": after().pageBuilder}',
      },
    }),
  ],
})
