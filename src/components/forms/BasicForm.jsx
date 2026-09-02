import { useRef } from 'react'
import { AlertTriangle, Camera, Image as ImageIcon, Trash2 } from 'lucide-react'
import { useResumeStore } from '../../store/useResumeStore'
import { Field, TextInput, Toggle } from '../ui/fields'

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const PHONE_RE = /^[+\d][\d\s().-]{6,}$/

export function BasicForm() {
  const basic = useResumeStore((s) => s.basic)
  const setBasic = useResumeStore((s) => s.setBasic)
  const fileInputRef = useRef(null)

  const P = (key) => ({
    value: basic[key] || '',
    onChange: (e) => setBasic({ [key]: e.target.value }),
  })

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setBasic({ avatar: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const removeAvatar = () => {
    setBasic({ avatar: '' })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-4">
      {/* Avatar / Photo Uploader */}
      <div className="rounded-lg border border-[#E8E4DC] bg-[#FBF9F5]/70 p-3 space-y-3">
        {/* ATS Warning Box */}
        <div className="flex items-start gap-2 rounded-lg border border-amber-200/80 bg-amber-50/90 p-2.5 text-[11px] text-amber-900 shadow-sm">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-600" />
          <div className="flex-1 leading-snug">
            <span className="font-semibold">ATS Compliance Warning:</span> Standard US/EU screeners may fail to parse resumes containing photos.
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E8E4DC] bg-white text-[#666055] shadow-sm">
            {basic.avatar ? (
              <img src={basic.avatar} alt="Profile preview" className={`h-full w-full object-cover transition-opacity ${basic.hidePhotoForAts ? 'opacity-40 grayscale' : ''}`} />
            ) : (
              <span className="font-display text-xl text-[#FF5E1A]">
                {basic.fullName ? basic.fullName.charAt(0).toUpperCase() : <ImageIcon size={20} className="text-[#8C857B]" />}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-[#1A1A1A]">Profile Photo</p>
              {basic.avatar && (
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${basic.hidePhotoForAts ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {basic.hidePhotoForAts ? 'Hidden on ATS' : 'Visible on ATS'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#666055]">Optional headshot for studio resume header</p>
            <div className="mt-1.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 rounded border border-[#E8E4DC] bg-white px-2 py-1 text-[11px] font-medium text-[#1A1A1A] hover:bg-[#F5F2EC] transition-colors"
              >
                <Camera size={12} className="text-[#FF5E1A]" />
                {basic.avatar ? 'Change photo' : 'Upload photo'}
              </button>
              {basic.avatar && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 size={12} /> Remove
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* ATS Photo Guard Toggle */}
        <div className="flex items-center justify-between border-t border-[#E8E4DC] pt-2.5">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-medium text-[#1A1A1A]">Hide Photo for ATS Export</p>
            <p className="text-[10.5px] text-[#666055]">Hides photo from canvas & PDF export while keeping uploaded image state</p>
          </div>
          <Toggle
            checked={Boolean(basic.hidePhotoForAts)}
            onChange={(checked) => setBasic({ hidePhotoForAts: checked })}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Full Name *" hint="Strictly drives the PDF file name">
          <TextInput placeholder="e.g. David St. Peter" {...P('fullName')} />
        </Field>
        <Field label="Job Title / Headline">
          <TextInput placeholder="e.g. Senior Frontend Engineer" {...P('jobTitle')} />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Email Address">
          <TextInput type="email" placeholder="e.g. david.stpeter@example.com" {...P('email')} />
        </Field>
        <Field label="Phone Number">
          <TextInput type="tel" placeholder="e.g. +1 (555) 234-5678" {...P('phone')} />
        </Field>
      </div>

      <Field label="Location">
        <TextInput placeholder="e.g. San Francisco, CA" {...P('location')} />
      </Field>
    </div>
  )
}
