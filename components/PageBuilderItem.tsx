import React, {useMemo} from 'react'
import {useFormValue} from 'sanity'

type PageBuilderArrayItemProps = {
  value?: {_key?: string}
  readOnly?: boolean
  renderDefault: (props: any) => React.ReactNode
  schemaType?: any
}

export default function PageBuilderItem(props: PageBuilderArrayItemProps) {
  const lockedKeysRaw = useFormValue(['templateLockedKeys']) as string[] | undefined
  const lockedKeys = useMemo(() => lockedKeysRaw || [], [lockedKeysRaw])
  const isLocked = Boolean(props.value?._key && lockedKeys.includes(props.value._key))

  const overriddenProps = useMemo(() => {
    if (!isLocked) return props
    const st = (props as any).schemaType || {}
    const options = {
      ...(st.options || {}),
      disableActions: ['remove', 'duplicate', 'addBefore', 'addAfter', 'copy'],
    }
    return {
      ...props,
      readOnly: true,
      schemaType: {...st, options},
    }
  }, [isLocked, props])

  return <>{props.renderDefault(overriddenProps)}</>
}
