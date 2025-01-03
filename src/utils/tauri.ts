export const isTauri = () => {
  return Boolean(
    // @ts-expect-error window
    typeof window !== 'undefined' && window !== undefined && window.__TAURI_IPC__ !== undefined,
  )
}
