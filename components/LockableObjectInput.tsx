import React, {useMemo} from 'react'
import {useFormValue} from 'sanity'

type LockableObjectInputProps = {
  value?: {_key?: string}
  renderDefault: (props: any) => React.ReactNode
}

function makeReadOnly<T extends object | unknown[] | null>(
  value: T,
  keys: string[] = ['item', 'field', 'fields', 'members', 'of', 'type', 'array', 'items'],
  seen = new WeakSet(),
): T {
  if (value == null || typeof value !== 'object' || seen.has(value as object)) return value as T
  seen.add(value as object)

  if (Array.isArray(value)) {
    return value.map((item) => makeReadOnly(item as any, keys, seen)) as T
  }

  const result: Record<string, unknown> = {...(value as Record<string, unknown>), readOnly: true}
  const objectKeys = Object.keys(value as Record<string, unknown>)
  const keysToProcess = objectKeys.filter((key) => keys.includes(key))
  for (const key of keysToProcess) {
    const val = (value as Record<string, unknown>)[key]
    const shouldMakeReadOnly = val && typeof val === 'object'
    result[key] = shouldMakeReadOnly ? makeReadOnly(val as any, keys, seen) : val
  }
  return result as T
}

export default function LockableObjectInput(props: LockableObjectInputProps) {
  const lockedKeysRaw = useFormValue(['templateLockedKeys']) as string[] | undefined
  const lockedKeys = useMemo(() => lockedKeysRaw || [], [lockedKeysRaw])
  const isLocked = Boolean(props.value?._key && lockedKeys.includes(props.value._key))
  const roProps = useMemo(
    () => (isLocked ? (makeReadOnly(props as any) as any) : props),
    [isLocked, props],
  )

  return <>{props.renderDefault(roProps)}</>
}
