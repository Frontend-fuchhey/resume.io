import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useResumeStore } from '../../store/useResumeStore'
import { clamp } from '../../lib/utils'
import { FloatingCanvasToolbar } from '../editor/FloatingCanvasToolbar'

import AtsStudioTemplate from './templates/AtsStudioTemplate'
import ClassicTemplate from './templates/ClassicTemplate'
import TechTemplate from './templates/TechTemplate'
import ExecutiveTemplate from './templates/ExecutiveTemplate'

export const PAGE_W = 794 // A4 @ 96dpi
export const LETTER_W = 816 // US Letter @ 96dpi

const TEMPLATES = {
  'ats-studio': AtsStudioTemplate,
  classic: ClassicTemplate,
  tech: TechTemplate,
  exec: ExecutiveTemplate,
}

const SHADOW_MAP = {
  none: 'shadow-none',
  subtle: 'shadow-card ring-1 ring-[#E8E4DC]',
  medium: 'shadow-sheet ring-1 ring-black/5',
  deep: 'shadow-2xl ring-1 ring-black/10',
}

const SHAPE_MAP = {
  sharp: 'rounded-none',
  rounded: 'rounded-lg',
  smooth: 'rounded-2xl',
}

const OUTLINE_MAP = {
  none: 'border-0',
  hairline: 'border border-[#E8E4DC]',
  accent: 'border-2 border-[#FF5E1A]/50',
}

export function PreviewPane({ onDownload, isDownloading, onOpenImport, onOpenHistory }) {
  const resume = useResumeStore()
  const templateId = resume.templateId || 'ats-studio'
  const formatting = resume.formatting || {}
  const Template = TEMPLATES[templateId] || AtsStudioTemplate

  const wrapRef = useRef(null)
  const innerRef = useRef(null)

  const [fitScale, setFitScale] = useState(0.48)
  const [zoomSetting, setZoomSetting] = useState('Fit')
  const [naturalH, setNaturalH] = useState(1123)

  const isLetter = formatting.canvasDimensions === 'Letter'
  const pageWidth = isLetter ? LETTER_W : PAGE_W
  const pageMinHeight = isLetter ? 1056 : 1123

  const measure = useCallback(() => {
    const el = innerRef.current
    if (el) setNaturalH(el.offsetHeight)
  }, [])

  useLayoutEffect(measure, [measure, templateId, resume])

  useEffect(() => {
    const el = innerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(() => setNaturalH(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined
    const measureFit = () => {
      const available = el.clientWidth - 56
      setFitScale(clamp(available / pageWidth, 0.2, 1.1))
    }
    measureFit()
    const ro = new ResizeObserver(measureFit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [pageWidth])

  // Determine computed scale factor
  let scale = fitScale
  if (zoomSetting === '32%') scale = 0.32
  else if (zoomSetting === '50%') scale = 0.5
  else if (zoomSetting === '75%') scale = 0.75
  else if (zoomSetting === '100%') scale = 1.0
  else scale = fitScale

  const overflows = naturalH > pageMinHeight + 6

  // Canvas styling classes from Right Toolbar
  const shadowClass = SHADOW_MAP[formatting.canvasShadow || 'subtle']
  const shapeClass = SHAPE_MAP[formatting.canvasShape || 'sharp']
  const outlineClass = OUTLINE_MAP[formatting.canvasOutline || 'none']

  const pageCount = Math.max(1, Math.ceil(naturalH / pageMinHeight))
  const pageBreaks = []
  if (overflows) {
    for (let p = 1; p < pageCount; p++) {
      pageBreaks.push(p * pageMinHeight)
    }
  }

  return (
    <div className="relative flex h-full min-w-0 flex-col bg-[#FBF9F5]">
      {/* Floating Canvas Toolbar anchored at the top center */}
      <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2">
        <FloatingCanvasToolbar
          zoom={zoomSetting}
          onZoomChange={(val) => setZoomSetting(val)}
          zoomOptions={['32%', '50%', '75%', '100%', 'Fit']}
          onDownload={onDownload}
          isDownloading={isDownloading}
          onOpenImport={onOpenImport}
          onOpenHistory={onOpenHistory}
        />
      </div>

      {/* Center Canvas Pane (resting over Anthropic light sand background) */}
      <div
        ref={wrapRef}
        className="studio-grid relative min-h-0 flex-1 overflow-auto p-8 pt-16"
      >
        <div className="sticky top-2 z-10 mx-auto mb-4 flex items-center gap-2 rounded-full border border-[#E8E4DC] bg-white/95 px-3.5 py-1 text-[11px] font-medium text-[#403D39] shadow-sm backdrop-blur-xs">
          <span className={`flex h-2 w-2 rounded-full ${pageCount > 1 ? 'bg-[#FF5E1A]' : 'bg-emerald-500'}`} />
          <span>
            <strong>{pageCount} {pageCount === 1 ? 'Page' : 'Pages'}</strong> · {isLetter ? 'US Letter' : 'A4 Standard'}
            {pageCount > 1 && (
              <span className="text-[#8C857B] ml-1.5 hidden sm:inline">
                (Content flows naturally with protected page breaks)
              </span>
            )}
          </span>
        </div>

        <div className="flex justify-center pb-12">
          <div
            className="relative transition-all duration-150"
            style={{
              width: pageWidth * scale,
              height: naturalH * scale,
            }}
          >
            <div
              className="absolute left-0 top-0 origin-top-left transition-transform duration-150"
              style={{
                width: pageWidth,
                transform: `scale(${scale})`,
              }}
            >
              <div
                id="resume-canvas"
                ref={innerRef}
                className={`resume-printable-area relative mx-auto bg-white ${shadowClass} ${shapeClass} ${outlineClass}`}
                style={{
                  width: pageWidth,
                  minHeight: pageMinHeight,
                  height: 'auto',
                  overflow: 'visible',
                  color: formatting.accentColor || '#244CEC',
                }}
              >
                {/* Page Break Boundaries Visualizer */}
                {pageBreaks.map((breakY, idx) => (
                  <div
                    key={idx}
                    data-html2canvas-ignore="true"
                    className="pointer-events-none absolute left-0 right-0 z-30 flex items-center justify-between select-none px-6"
                    style={{ top: breakY - 12 }}
                  >
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E8E4DC] to-[#E8E4DC]" />
                    <span className="mx-3 rounded-full border border-[#E8E4DC] bg-white/95 px-3 py-0.5 text-[9.5px] font-semibold tracking-wide text-[#666055] shadow-xs backdrop-blur-xs flex items-center gap-1.5 uppercase">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FF5E1A]" />
                      Page {idx + 2} Starts Here
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#E8E4DC] to-[#E8E4DC]" />
                  </div>
                ))}

                <Template resume={resume} theme={{ accentColor: formatting.accentColor || '#244CEC' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
