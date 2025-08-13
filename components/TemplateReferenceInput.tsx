import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react'
import {Card, Box, Button, Flex, Stack, Text} from '@sanity/ui'
import {WarningOutlineIcon} from '@sanity/icons'
import {useClient, useDocumentOperation, useFormValue, getPublishedId} from 'sanity'

type ReferenceValue = {
  _type: 'reference'
  _ref: string
} | null

type TemplateReferenceInputProps = {
  value: ReferenceValue
  renderDefault: (props: any) => React.ReactNode
  // Supplied by Sanity for field inputs
  documentId: string
  schemaType: {name: string}
}

export default function TemplateReferenceInput(props: TemplateReferenceInputProps) {
  const {value} = props
  const client = useClient({apiVersion: '2024-05-01'})
  const formDocId = useFormValue(['_id']) as string | undefined
  const docType = (useFormValue(['_type']) as string | undefined) || 'page'
  const docId = (formDocId || (props as any).documentId || '') as string
  const publishedDocId = docId ? getPublishedId(docId) : ''
  const {patch} = useDocumentOperation(publishedDocId, docType)
  const prevRef = useRef<string | undefined>(value && (value as any)._ref)
  const templateRef = (value as any)?._ref as string | undefined
  const pageBuilderValue = useFormValue(['pageBuilder']) as unknown
  const hasExistingContent = useMemo(
    () => Array.isArray(pageBuilderValue) && pageBuilderValue.length > 0,
    [pageBuilderValue],
  )
  const [templateTitle, setTemplateTitle] = useState<string | undefined>()

  useEffect(() => {
    const nextRef = (value as any)?._ref as string | undefined

    // Require a valid document id before attempting to patch
    if (!publishedDocId) return

    // If cleared, drop locks
    if (!nextRef && prevRef.current) {
      patch.execute([{unset: ['templateLockedKeys']}])
      prevRef.current = undefined
      return
    }

    if (!nextRef || nextRef === prevRef.current) return

    let cancelled = false
    const applyTemplate = async () => {
      try {
        const template = await client.fetch(`*[_id == $id][0]{pageBuilder}`, {id: nextRef})
        if (cancelled) return
        const templateBlocks = Array.isArray(template?.pageBuilder) ? template.pageBuilder : []
        const lockedKeys = templateBlocks
          .map((b: any) => b && b._key)
          .filter((k: any): k is string => typeof k === 'string')

        // Apply the template blocks exactly as-is and record locked keys
        patch.execute([{set: {pageBuilder: templateBlocks, templateLockedKeys: lockedKeys}}])
        prevRef.current = nextRef
      } catch (err) {
        console.error('Failed to apply template', err)
      }
    }

    applyTemplate()
    return () => {
      cancelled = true
    }
  }, [client, patch, value, publishedDocId])

  // Fetch template title for preview when a template is selected
  useEffect(() => {
    let cancelled = false
    async function fetchTitle(id: string) {
      try {
        const res = await client.fetch<{title?: string}>(`*[_id == $id][0]{title}`, {id})
        if (!cancelled) setTemplateTitle(res?.title || 'Untitled Template')
      } catch {
        if (!cancelled) setTemplateTitle('Untitled Template')
      }
    }
    if (templateRef) {
      fetchTitle(templateRef)
    } else {
      setTemplateTitle(undefined)
    }
    return () => {
      cancelled = true
    }
  }, [client, templateRef])

  const handleDisconnect = useCallback(() => {
    if (!publishedDocId) return
    patch.execute([{unset: ['template']}])
  }, [patch, publishedDocId])

  if (templateRef) {
    return (
      <Card border padding={3} radius={2} tone="transparent">
        <Flex align="center" justify="space-between">
          <Box>
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Selected template
              </Text>
              <Text size={1}>{templateTitle || 'Loading…'}</Text>
            </Stack>
          </Box>
          <Button
            text="Disconnect template"
            tone="critical"
            mode="ghost"
            onClick={handleDisconnect}
          />
        </Flex>
      </Card>
    )
  }

  return (
    <Stack space={3}>
      <Box>{props.renderDefault(props)}</Box>
      {hasExistingContent ? (
        <Card border padding={3} radius={2} tone="caution">
          <Flex align="center">
            <Box marginRight={3}>
              <Text size={1}>
                <WarningOutlineIcon />
              </Text>
            </Box>
            <Text size={1}>
              Selecting a new template will replace all content in the page builder field.
            </Text>
          </Flex>
        </Card>
      ) : null}
    </Stack>
  )
}
