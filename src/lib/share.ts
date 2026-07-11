import type { ShareableArtifact } from '../types/shareable'

const SHARE_PARAM = 'share'
const VERSION = 1

export function encodeShareUrl(artifact: ShareableArtifact): string {
  const data = JSON.stringify({ ...artifact, version: VERSION })
  const encoded = btoa(unescape(encodeURIComponent(data)))
  const url = new URL(window.location.href)
  url.searchParams.set(SHARE_PARAM, encoded)
  return url.toString()
}

export function decodeShareData(): ShareableArtifact | null {
  const url = new URL(window.location.href)
  const raw = url.searchParams.get(SHARE_PARAM)
  if (!raw) return null

  try {
    const decoded = decodeURIComponent(escape(atob(raw)))
    const parsed = JSON.parse(decoded) as ShareableArtifact

    // Validate version
    if (parsed.version !== VERSION) return null

    return parsed
  } catch {
    return null
  }
}

export function clearShareFromUrl() {
  const url = new URL(window.location.href)
  url.searchParams.delete(SHARE_PARAM)
  window.history.replaceState({}, '', url.toString())
}

export function exportArtifactToJson(artifact: ShareableArtifact) {
  const json = JSON.stringify(artifact, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const downloadUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = downloadUrl
  a.download = `lci-plan-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(downloadUrl)
}
