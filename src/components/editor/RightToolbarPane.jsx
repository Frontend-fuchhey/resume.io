import { useState } from 'react'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Check,
  ChevronDown,
  Download,
  Share2,
} from 'lucide-react'
import { useResumeStore } from '../../store/useResumeStore'
import { toast } from '../../store/useUIStore'
import { STUDIO_PALETTE } from '../../../skills/ui-ux-pro-max'

export function RightToolbarPane({ onDownload, isDownloading }) {
  const formatting = useResumeStore((s) => s.formatting || {})
  const setFormatting = useResumeStore((s) => s.setFormatting)

  // Style accordion expansion states
  const [openDimensions, setOpenDimensions] = useState(true)
  const [openShape, setOpenShape] = useState(false)
  const [openShadow, setOpenShadow] = useState(false)
  const [openOutline, setOpenOutline] = useState(false)

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast('Share link copied to clipboard!')
    } else {
      toast('Ready to share: link generated')
    }
  }

  const activeFontFamily = formatting.fontFamily || 'Poppins'
  const activeFontWeight = formatting.fontWeight || '400'
  const activeFontSize = formatting.fontSize || 10.5
  const activeAccent = formatting.accentColor || STUDIO_PALETTE.accentBlueDefault
  const activeAlign = formatting.textAlign || 'left'
  const activeLineHeight = formatting.lineHeight || 140
  const activeLetterSpacing = formatting.letterSpacing ?? 0
  const activeDimensions = formatting.canvasDimensions || 'A4'
  const activeShape = formatting.canvasShape || 'sharp'
  const activeShadow = formatting.canvasShadow || 'subtle'
  const activeOutline = formatting.canvasOutline || 'none'

  return (
    <div className="flex h-full flex-col bg-[#FBF9F5] border-l border-[#E8E4DC]">
      {/* Top Header Bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#E8E4DC] bg-white px-3.5 py-2.5">
        {/* Saved Badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-[#D1EED5] bg-[#EBF7EE] px-2 py-0.5 text-[11px] font-medium text-[#1E7E34]">
          <Check size={12} strokeWidth={2.6} />
          <span>Saved</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDownload}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8E4DC] bg-white px-3 py-1.5 text-xs font-semibold text-[#1A1A1A] hover:bg-[#F5F2EC] hover:border-[#D6D0C5] transition-colors disabled:opacity-50"
          >
            <Download size={13} strokeWidth={2.2} />
            <span>{isDownloading ? 'Building…' : 'Download'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF5E1A] hover:bg-[#E04D0E] px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_2px_8px_rgba(255,94,26,0.25)] transition-all active:scale-[0.98]"
          >
            <Share2 size={13} strokeWidth={2.2} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Scrollable Design Panels */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* 1. Alignment Panel */}
        <div className="rounded-xl border border-[#E8E4DC] bg-white p-3 shadow-card">
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[#666055]">
            Text Alignment
          </label>
          <div className="grid grid-cols-4 gap-1 rounded-lg border border-[#E8E4DC] bg-[#FBF9F5] p-1">
            {[
              { id: 'left', icon: AlignLeft, label: 'Left' },
              { id: 'center', icon: AlignCenter, label: 'Center' },
              { id: 'right', icon: AlignRight, label: 'Right' },
              { id: 'justify', icon: AlignJustify, label: 'Distribute' },
            ].map(({ id, icon: Icon, label }) => {
              const active = activeAlign === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFormatting({ textAlign: id })}
                  title={label}
                  className={`flex h-8 items-center justify-center rounded-md transition-all ${
                    active
                      ? 'bg-white text-[#FF5E1A] shadow-sm font-bold border border-[#E8E4DC]'
                      : 'text-[#666055] hover:text-[#1A1A1A] hover:bg-white/50'
                  }`}
                >
                  <Icon size={15} strokeWidth={2.2} />
                </button>
              )
            })}
          </div>
        </div>

        {/* 2. Text Formatting Panel */}
        <div className="rounded-xl border border-[#E8E4DC] bg-white p-3 shadow-card space-y-3.5">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#666055]">
            Text Formatting
          </label>

          {/* Font Selector */}
          <div>
            <div className="mb-1 text-[11px] font-medium text-[#1A1A1A]">Font Family</div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'Poppins', font: 'Poppins', class: 'font-sans' },
                { label: 'Courgette', font: 'Courgette', class: 'font-display' },
              ].map((f) => (
                <button
                  key={f.font}
                  type="button"
                  onClick={() => setFormatting({ fontFamily: f.font })}
                  className={`flex items-center justify-center rounded-lg border px-2.5 py-1.5 text-xs transition-all ${
                    activeFontFamily === f.font
                      ? 'border-[#FF5E1A] bg-[#FFF3EB] text-[#FF5E1A] font-semibold shadow-sm'
                      : 'border-[#E8E4DC] bg-white text-[#1A1A1A] hover:bg-[#F5F2EC]'
                  } ${f.class}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Weight & Size */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="mb-1 text-[11px] font-medium text-[#1A1A1A]">Weight</div>
              <select
                value={activeFontWeight}
                onChange={(e) => setFormatting({ fontWeight: e.target.value })}
                className="w-full rounded-lg border border-[#E8E4DC] bg-[#FBF9F5] px-2 py-1.5 text-xs text-[#1A1A1A] outline-none hover:border-[#D6D0C5] focus:border-[#FF5E1A]"
              >
                <option value="300">Light (300)</option>
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">SemiBold (600)</option>
                <option value="700">Bold (700)</option>
              </select>
            </div>

            <div>
              <div className="mb-1 text-[11px] font-medium text-[#1A1A1A]">Base Size ({activeFontSize}pt)</div>
              <input
                type="range"
                min="9"
                max="13"
                step="0.5"
                value={activeFontSize}
                onChange={(e) => setFormatting({ fontSize: parseFloat(e.target.value) })}
                className="w-full accent-[#FF5E1A] mt-2 cursor-pointer"
              />
            </div>
          </div>

          {/* Accent Color Code Swatch (default #244CEC or custom hex) */}
          <div>
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-[#1A1A1A]">
              <span>Accent Color Swatch</span>
              <span className="font-mono text-[10px] text-[#666055] uppercase">{activeAccent}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                {[
                  { name: 'Studio Blue', hex: '#244CEC' },
                  { name: 'Energetic Orange', hex: '#FF5E1A' },
                  { name: 'Charcoal', hex: '#1A1A1A' },
                  { name: 'Teal Forest', hex: '#0F766E' },
                  { name: 'Violet', hex: '#7C3AED' },
                ].map((s) => (
                  <button
                    key={s.hex}
                    type="button"
                    title={`${s.name} (${s.hex})`}
                    onClick={() => setFormatting({ accentColor: s.hex })}
                    className={`h-6 w-6 rounded-full border-2 transition-transform ${
                      activeAccent.toLowerCase() === s.hex.toLowerCase()
                        ? 'border-black scale-110 shadow-sm'
                        : 'border-white hover:scale-105'
                    }`}
                    style={{ backgroundColor: s.hex }}
                  />
                ))}
              </div>
              <div className="relative flex-1 flex items-center">
                <input
                  type="color"
                  value={activeAccent}
                  onChange={(e) => setFormatting({ accentColor: e.target.value })}
                  className="h-7 w-8 cursor-pointer rounded border border-[#E8E4DC] bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={activeAccent}
                  onChange={(e) => setFormatting({ accentColor: e.target.value })}
                  placeholder="#244CEC"
                  className="ml-1.5 w-full rounded-md border border-[#E8E4DC] bg-[#FBF9F5] px-2 py-1 font-mono text-[11px] uppercase text-[#1A1A1A] outline-none focus:border-[#FF5E1A]"
                />
              </div>
            </div>
          </div>

          {/* Line Height % & Letter Spacing % */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E8E4DC]">
            <div>
              <div className="mb-1 text-[11px] font-medium text-[#1A1A1A]">Line Height</div>
              <div className="flex items-center gap-1">
                {[130, 140, 150].map((lh) => (
                  <button
                    key={lh}
                    type="button"
                    onClick={() => setFormatting({ lineHeight: lh })}
                    className={`flex-1 rounded py-1 text-[11px] font-medium transition-colors ${
                      activeLineHeight === lh
                        ? 'bg-[#1A1A1A] text-white'
                        : 'bg-[#F5F2EC] text-[#666055] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {lh}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1 text-[11px] font-medium text-[#1A1A1A]">Letter Spacing</div>
              <div className="flex items-center gap-1">
                {[-1, 0, 2].map((ls) => (
                  <button
                    key={ls}
                    type="button"
                    onClick={() => setFormatting({ letterSpacing: ls })}
                    className={`flex-1 rounded py-1 text-[11px] font-medium transition-colors ${
                      activeLetterSpacing === ls
                        ? 'bg-[#1A1A1A] text-white'
                        : 'bg-[#F5F2EC] text-[#666055] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {ls}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Style Accordions */}
        <div className="space-y-2">
          {/* Canvas Dimensions */}
          <div className="rounded-xl border border-[#E8E4DC] bg-white overflow-hidden shadow-card">
            <button
              type="button"
              onClick={() => setOpenDimensions((o) => !o)}
              className="flex w-full items-center justify-between px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] hover:bg-[#FBF9F5]"
            >
              <span>Canvas Dimensions</span>
              <ChevronDown
                size={14}
                className={`transition-transform text-[#666055] ${openDimensions ? 'rotate-180' : ''}`}
              />
            </button>
            {openDimensions && (
              <div className="border-t border-[#E8E4DC] p-3 space-y-2 bg-[#FBF9F5]/40">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'A4', label: 'A4 Standard', desc: '210 × 297 mm' },
                    { id: 'Letter', label: 'US Letter', desc: '8.5 × 11 in' },
                  ].map((dim) => (
                    <button
                      key={dim.id}
                      type="button"
                      onClick={() => setFormatting({ canvasDimensions: dim.id })}
                      className={`rounded-lg border p-2 text-left transition-all ${
                        activeDimensions === dim.id
                          ? 'border-[#FF5E1A] bg-[#FFF3EB] text-[#FF5E1A]'
                          : 'border-[#E8E4DC] bg-white text-[#1A1A1A] hover:bg-[#F5F2EC]'
                      }`}
                    >
                      <div className="text-xs font-semibold">{dim.label}</div>
                      <div className="text-[10px] text-[#666055]">{dim.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Shape */}
          <div className="rounded-xl border border-[#E8E4DC] bg-white overflow-hidden shadow-card">
            <button
              type="button"
              onClick={() => setOpenShape((o) => !o)}
              className="flex w-full items-center justify-between px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] hover:bg-[#FBF9F5]"
            >
              <span>Shape (Corners)</span>
              <ChevronDown
                size={14}
                className={`transition-transform text-[#666055] ${openShape ? 'rotate-180' : ''}`}
              />
            </button>
            {openShape && (
              <div className="border-t border-[#E8E4DC] p-3 grid grid-cols-3 gap-1.5 bg-[#FBF9F5]/40">
                {[
                  { id: 'sharp', label: 'Sharp (0px)' },
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'smooth', label: 'Smooth' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFormatting({ canvasShape: s.id })}
                    className={`rounded-lg border py-1.5 text-xs font-medium transition-all ${
                      activeShape === s.id
                        ? 'border-[#FF5E1A] bg-[#FFF3EB] text-[#FF5E1A]'
                        : 'border-[#E8E4DC] bg-white text-[#1A1A1A] hover:bg-[#F5F2EC]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Shadow */}
          <div className="rounded-xl border border-[#E8E4DC] bg-white overflow-hidden shadow-card">
            <button
              type="button"
              onClick={() => setOpenShadow((o) => !o)}
              className="flex w-full items-center justify-between px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] hover:bg-[#FBF9F5]"
            >
              <span>Shadow Elevation</span>
              <ChevronDown
                size={14}
                className={`transition-transform text-[#666055] ${openShadow ? 'rotate-180' : ''}`}
              />
            </button>
            {openShadow && (
              <div className="border-t border-[#E8E4DC] p-3 grid grid-cols-2 gap-1.5 bg-[#FBF9F5]/40">
                {[
                  { id: 'none', label: 'Flat (None)' },
                  { id: 'subtle', label: 'Subtle Studio' },
                  { id: 'medium', label: 'Warm Soft' },
                  { id: 'deep', label: 'Deep Sheet' },
                ].map((sh) => (
                  <button
                    key={sh.id}
                    type="button"
                    onClick={() => setFormatting({ canvasShadow: sh.id })}
                    className={`rounded-lg border py-1.5 text-xs font-medium transition-all ${
                      activeShadow === sh.id
                        ? 'border-[#FF5E1A] bg-[#FFF3EB] text-[#FF5E1A]'
                        : 'border-[#E8E4DC] bg-white text-[#1A1A1A] hover:bg-[#F5F2EC]'
                    }`}
                  >
                    {sh.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Outline Effects */}
          <div className="rounded-xl border border-[#E8E4DC] bg-white overflow-hidden shadow-card">
            <button
              type="button"
              onClick={() => setOpenOutline((o) => !o)}
              className="flex w-full items-center justify-between px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] hover:bg-[#FBF9F5]"
            >
              <span>Outline & Borders</span>
              <ChevronDown
                size={14}
                className={`transition-transform text-[#666055] ${openOutline ? 'rotate-180' : ''}`}
              />
            </button>
            {openOutline && (
              <div className="border-t border-[#E8E4DC] p-3 grid grid-cols-3 gap-1.5 bg-[#FBF9F5]/40">
                {[
                  { id: 'none', label: 'None' },
                  { id: 'hairline', label: 'Hairline' },
                  { id: 'accent', label: 'Accent' },
                ].map((out) => (
                  <button
                    key={out.id}
                    type="button"
                    onClick={() => setFormatting({ canvasOutline: out.id })}
                    className={`rounded-lg border py-1.5 text-xs font-medium transition-all ${
                      activeOutline === out.id
                        ? 'border-[#FF5E1A] bg-[#FFF3EB] text-[#FF5E1A]'
                        : 'border-[#E8E4DC] bg-white text-[#1A1A1A] hover:bg-[#F5F2EC]'
                    }`}
                  >
                    {out.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
