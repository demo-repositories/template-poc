import {createClient} from '@sanity/client'
import {documentEventHandler} from '@sanity/functions'

export const handler = documentEventHandler(async ({context, event}) => {
  const {_id, pageBuilder, lastPageBuilder} = event.data
  const client = createClient({
    ...context.clientOptions,
    useCdn: false,
    apiVersion: '2025-05-08',
  })

  try {
    // If there's no pageBuilder on the template, there is nothing to copy
    if (!pageBuilder || (Array.isArray(pageBuilder) && pageBuilder.length === 0)) {
      console.log('No pageBuilder provided on template, skipping update')
      return
    }

    const pagesUsingTemplate = await client.fetch(
      '*[_type == "page" && references($id)] {_id, pageBuilder}',
      {
        id: _id,
      },
    )

    if (pagesUsingTemplate.length === 0) {
      console.log('No pages reference this template, nothing to update')
      return
    }

    // Helper: Build current and last template maps/sets
    const currentTemplateItems = Array.isArray(pageBuilder) ? pageBuilder : []
    const lastTemplateItems = Array.isArray(lastPageBuilder) ? lastPageBuilder : []

    const currentKeysInOrder: string[] = []
    const currentKeyToItem = new Map<string, any>()
    for (const item of currentTemplateItems) {
      if (item && typeof item === 'object' && typeof item._key === 'string') {
        currentKeysInOrder.push(item._key)
        currentKeyToItem.set(item._key, item)
      }
    }

    const lastKeys = new Set<string>(
      lastTemplateItems
        .map((it: any) =>
          it && typeof it === 'object' && typeof it._key === 'string' ? it._key : undefined,
        )
        .filter(Boolean) as string[],
    )
    const currentKeys = new Set<string>(currentKeysInOrder)

    type PageDoc = {_id: string; pageBuilder?: Array<any>}
    const pages = pagesUsingTemplate as PageDoc[]

    // Build and commit a single transaction to update only changed pages
    // If this gets to a bigger scale, we should split this into multiple transactions
    let tx = client.transaction()
    let pagesPatched = 0
    const changedPageIds: string[] = []

    for (const page of pages) {
      const original = Array.isArray(page.pageBuilder) ? page.pageBuilder : []

      const updated: any[] = []
      let templateCursor = 0

      for (const item of original) {
        const key: string | undefined = item && typeof item === 'object' ? item._key : undefined

        // Remove items that belonged to the last template but are no longer in the current template
        if (key && lastKeys.has(key) && !currentKeys.has(key)) {
          continue
        }

        // For items that are part of the current template, place the next template item to preserve template order
        if (key && currentKeys.has(key)) {
          if (templateCursor < currentKeysInOrder.length) {
            const nextKey = currentKeysInOrder[templateCursor]
            const replacement = currentKeyToItem.get(nextKey)
            updated.push(replacement)
            templateCursor += 1
          } else {
            // Fallback: no more template items; keep original
            updated.push(item)
          }
          continue
        }

        // Otherwise keep override items as-is
        updated.push(item)
      }

      // Append remaining new template items that had no slots in the original page
      while (templateCursor < currentKeysInOrder.length) {
        const nextKey = currentKeysInOrder[templateCursor]
        const replacement = currentKeyToItem.get(nextKey)
        updated.push(replacement)
        templateCursor += 1
      }

      // Patch only if there is a real change - a simple way to compare is to stringify the arrays and compare the strings
      const changed = (() => {
        try {
          return JSON.stringify(original) !== JSON.stringify(updated)
        } catch {
          return true
        }
      })()

      // If there is a change, we need to patch the page
      if (changed) {
        pagesPatched += 1
        changedPageIds.push(page._id)
        tx = tx.patch(page._id, {
          set: {pageBuilder: updated, templateLockedKeys: currentKeysInOrder},
        })
      }
    }

    if (pagesPatched === 0) {
      console.log('No changes required. All pages already aligned with template ordering/content.')
      return
    }

    // Commit the transaction - dry run locally.
    const result = await tx.commit({dryRun: context.local})

    console.log(
      context.local ? 'Dry run:' : 'Updated:',
      `Patched pageBuilder on ${pagesPatched} pages. Transaction: ${result.transactionId}. Pages: ${changedPageIds.join(', ')}`,
    )
  } catch (error) {
    console.error(error)
  }
})
