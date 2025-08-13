import React, {useMemo} from 'react'
import {Box, Flex, Badge} from '@sanity/ui'
import {PreviewProps, useFormValue} from 'sanity'

type PageBuilderPreviewProps = PreviewProps & {
  _key?: string
}

export default function PageBuilderPreview(props: PreviewProps) {
  const cast = props as PageBuilderPreviewProps
  const itemKey = cast._key
  const lockedKeysRaw = useFormValue(['templateLockedKeys']) as string[] | undefined
  const lockedKeys = useMemo(() => lockedKeysRaw || [], [lockedKeysRaw])
  const hasTemplateLockField = useMemo(() => lockedKeysRaw !== undefined, [lockedKeysRaw])
  const isLocked = useMemo(
    () => Boolean(itemKey && lockedKeys.includes(itemKey)),
    [itemKey, lockedKeys],
  )

  if (!hasTemplateLockField) {
    return <>{props.renderDefault(props)}</>
  }

  return (
    <Flex align="center">
      <Box flex={1}>{props.renderDefault(props)}</Box>
      {isLocked ? (
        <Badge tone="neutral" padding={2} fontSize={0}>
          TEMPLATE
        </Badge>
      ) : (
        <Badge tone="caution" padding={2} fontSize={0}>
          OVERRIDE
        </Badge>
      )}
    </Flex>
  )
}
