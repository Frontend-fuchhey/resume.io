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
  rounded: 'rounded-lg overflow-hidden',
  smooth: 'rounded-2xl overflow-hidden',
}

const OUTLINE_MAP = {
  none: 'border-0',
  hairline: 'border border-[#E8E4DC]',
  accent: 'border-2 border-[#FF5E1A]/50',
}

export function PreviewPane() {
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
        />
      </div>

      {/* Center Canvas Pane (resting over Anthropic light sand background) */}
      <div
        ref={wrapRef}
        className="studio-grid relative min-h-0 flex-1 overflow-auto p-8 pt-16"
      >
        {overflows && (
          <div className="sticky top-2 z-10 mx-auto mb-3 flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50/95 px-3.5 py-1 text-[11px] font-medium text-amber-800 shadow-sm backdrop-blur-xs">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>
              Content spans <strong>{pageCount} pages</strong> ({isLetter ? 'US Letter' : 'A4 Standard'}).
              Use <em>Compact</em> margin density or adjust spacing to keep single-page ATS.
            </span>
          </div>
        )}

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
                ref={innerRef}
                className={`relative mx-auto bg-white ${shadowClass} ${shapeClass} ${outlineClass}`}
                style={{
                  width: pageWidth,
                  minHeight: pageMinHeight,
                }}
              >
                {/* Page Break Boundaries Visualizer */}
                {pageBreaks.map((breakY, idx) => (
                  <div
                    key={idx}
                    className="pointer-events-none absolute left-0 right-0 z-30 flex items-center select-none"
                    style={{ top: breakY }}
                  >
                    <div className="h-0 flex-1 border-b-2 border-dashed border-rose-400/80" />
                    <span className="mx-2 shrink-0 rounded-full border border-rose-300 bg-rose-50/95 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-rose-700 shadow-sm uppercase backdrop-blur-xs">
                      Page Break · Page {idx + 2} Starts Here
                    </span>
                    <div className="h-0 w-8 border-b-2 border-dashed border-rose-400/80" />
                  </div>
                ))}

                <Template resume={resume} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
