import { McpIntroVideo } from '../components/announcement/McpIntroVideo'
import { McpPreviewVideo } from '../components/announcement/McpPreviewVideo'

/**
 * Dev-only stage for exporting the announcement clip (`#/announcement-video`): the clip alone, 1440px wide (scale 1),
 * on a plain page (1440×810 for the current clip, 16:9; 1440×860 for the zoom one). The export script pauses its
 * animations at each frame time and screenshots the page, at 8/3 device scale for a 3840×2160 video.
 * `?clip=zoom` shows the earlier zoom-tour clip instead of the current introduction.
 */
export function AnnouncementVideoPage() {
  const zoom = new URLSearchParams(window.location.hash.split('?')[1]).get('clip') === 'zoom'
  return (
    <div style={{ width: 1440, height: zoom ? 860 : 810, overflow: 'hidden' }}>
      {zoom ? <McpPreviewVideo replayKey={0} /> : <McpIntroVideo replayKey={0} />}
    </div>
  )
}
