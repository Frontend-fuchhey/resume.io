import React from 'react'
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { dateRange } from '../lib/format'
import { PDF_THEMES } from './tokens'

const A4 = { width: 595.28, height: 841.89 }

function makeTheme(t) {
  return {
    ...t,
    body: { fontFamily: t.bodyFont, fontSize: t.bodySize, color: t.ink, lineHeight: 1.45 },
    sm: { fontFamily: t.bodyFont, fontSize: t.bodySize - 1.2, color: t.muted, lineHeight: 1.4 },
    h1: { fontFamily: t.boldFont, fontSize: t.bodySize + 6 },
    h2: { fontFamily: t.boldFont, fontSize: t.bodySize + 0.6 },
    bold: { fontFamily: t.boldFont },
    italic: { fontFamily: t.italicFont },
    caps: { textTransform: 'uppercase' },
  }
}

const clean = (s = '') => String(s).trim()

/** Collapse sections down to a list of components with shared section builders. */
function useSectionAPI(th) {
  const SectionTitle = ({ label, underline, centered }) => (
    <View style={{ marginTop: 10, marginBottom: 6, ...(centered ? { alignItems: 'center' } : {}) }}>
      <Text
        style={{
          fontFamily: th.boldFont,
          fontSize: th.section === 'tech' ? th.bodySize : th.bodySize + 0.5,
          color: th.section === 'tech' || th.section === 'line-dot' ? th.accent : th.ink,
          textTransform: 'uppercase',
          letterSpacing: th.section === 'letterspaced' ? 1.6 : th.section === 'tech' ? 0.9 : 1,
        }}
      >
        {label}
      </Text>
      {underline !== false && <View style={{ marginTop: 2.5, height: 1, width: centered ? 26 : '100%', alignSelf: centered ? 'center' : 'stretch', backgroundColor: underline === 'accent' ? th.accent : th.muted + '55' }} />}
    </View>
  )

  const ContactText = ({ children }) => (
    <Text style={{ ...th.sm, fontSize: th.sm.fontSize - 0.4, color: th.muted }}>{children}</Text>
  )

  return { SectionTitle, ContactText }
}

/* ------------------------------------------------------------------ */
/*  Classic ATS                                                        */
/* ------------------------------------------------------------------ */
function ClassicDoc({ data, t }) {
  const th = makeTheme(t)
  const { SectionTitle } = useSectionAPI(th)
  const { basic, experience, education, skillGroups, projects, certifications, visibility } = data
  const contact = [basic.email, basic.phone, basic.location, basic.linkedin, basic.portfolio].filter(clean)

  return (
    <Page size={A4} style={{ paddingTop: 44, paddingRight: 48, paddingBottom: 44, paddingLeft: 48 }}>
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ ...th.h1, fontSize: 21, textTransform: 'uppercase', letterSpacing: 1.6 }}>
          {clean(basic.fullName) || 'Your Name'}
        </Text>
        {clean(basic.jobTitle) && (
          <Text style={{ ...th.sm, marginTop: 2, fontSize: 10.5 }}>{basic.jobTitle}</Text>
        )}
        <ContactText>{contact.join('   |   ')}</ContactText>
      </View>

      {clean(basic.summary) && (
        <>
          <SectionTitle label="Summary" underline="accent" />
          <Text style={th.body}>{basic.summary}</Text>
        </>
      )}

      {visibility.experience && experience.length > 0 && (
        <>
          <SectionTitle label="Work Experience" underline="accent" />
          {experience.map((exp) => {
            const has = clean(exp.role) || clean(exp.company) || exp.bullets.some(clean)
            if (!has) return null
            return (
              <View key={exp.id} style={{ marginBottom: 7, marginTop: 2 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={{ ...th.bold, fontSize: 10.4, flex: 1 }}>
                    {[clean(exp.role), clean(exp.company)].filter(Boolean).join(', ')}
                  </Text>
                  <Text style={{ ...th.sm, fontSize: th.sm.fontSize - 0.4 }}>{dateRange(exp)}</Text>
                </View>
                {clean(exp.location) && <Text style={{ ...th.italic, ...th.sm, fontSize: th.sm.fontSize - 0.4 }}>{exp.location}</Text>}
                {exp.bullets.filter(clean).map((b, i) => (
                  <Text key={i} style={{ ...th.body, fontSize: th.bodySize - 0.2, marginTop: 1.5, paddingLeft: 10 }}>
                    {'\u2022  '}
                    {b}
                  </Text>
                ))}
              </View>
            )
          })}
        </>
      )}

      {visibility.skills && skillGroups.some((g) => clean(g.label) && g.items.some(clean)) && (
        <>
          <SectionTitle label="Skills & Tools" underline="accent" />
          {skillGroups
            .filter((g) => clean(g.label) && g.items.some(clean))
            .map((g) => (
              <Text key={g.id} style={{ ...th.body, marginTop: 1.5 }}>
                <Text style={th.bold}>{g.label}: </Text>
                {g.items.filter(clean).join(', ')}
              </Text>
            ))}
        </>
      )}

      {visibility.projects && projects.some((p) => clean(p.name) || clean(p.description)) && (
        <>
          <SectionTitle label="Projects" underline="accent" />
          {projects
            .filter((p) => clean(p.name) || clean(p.description))
            .map((p) => (
              <View key={p.id} style={{ marginBottom: 5, marginTop: 1 }}>
                <Text style={{ ...th.bold, fontSize: 10 }}>
                  {clean(p.name)}
                  {clean(p.link) && <Text style={{ color: '#1d4ed8', fontFamily: th.bodyFont }}>  {p.link}</Text>}
                </Text>
                {clean(p.description) && <Text style={th.body}>{p.description}</Text>}
              </View>
            ))}
        </>
      )}

      {visibility.education && education.some((e) => clean(e.degree) || clean(e.school)) && (
        <>
          <SectionTitle label="Education" underline="accent" />
          {education
            .filter((e) => clean(e.degree) || clean(e.school))
            .map((e) => (
              <View key={e.id} style={{ marginBottom: 4, marginTop: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={{ ...th.bold, fontSize: 10, flex: 1 }}>
                    {[clean(e.degree), clean(e.school)].filter(Boolean).join(' — ')}
                  </Text>
                  {clean(e.gradYear) && <Text style={th.sm}>{e.gradYear}</Text>}
                </View>
                {clean(e.focus) && <Text style={{ ...th.italic, ...th.sm }}>{e.focus}</Text>}
              </View>
            ))}
        </>
      )}

      {visibility.certifications && certifications.some((c) => clean(c.name)) && (
        <>
          <SectionTitle label="Certifications" underline="accent" />
          {certifications
            .filter((c) => clean(c.name))
            .map((c) => (
              <Text key={c.id} style={{ ...th.body, marginTop: 1 }}>
                <Text style={th.bold}>{c.name}</Text>
                {clean(c.issuer) && <Text style={th.sm}>  ·  {c.issuer}</Text>}
                {clean(c.year) && <Text style={th.sm}>  ·  {c.year}</Text>}
              </Text>
            ))}
        </>
      )}
    </Page>
  )
}

/* ------------------------------------------------------------------ */
/*  Modern Cyber Minimal                                               */
/* ------------------------------------------------------------------ */
function CyberDoc({ data, t }) {
  const th = makeTheme(t)
  const { SectionTitle } = useSectionAPI(th)
  const { basic, experience, education, skillGroups, projects, certifications, visibility } = data
  const contact = [basic.phone, basic.email, basic.location, basic.linkedin, basic.portfolio].filter(clean)
  const band = '#164e63'

  return (
    <Page size={A4} style={{ padding: 0 }}>
      <View style={{ backgroundColor: band, paddingTop: 26, paddingRight: 34, paddingBottom: 18, paddingLeft: 34 }}>
        <Text style={{ fontFamily: th.boldFont, fontSize: 8, color: '#99f6e4', letterSpacing: 3, textTransform: 'uppercase' }}>
          {clean(basic.jobTitle) || 'Professional Resume'}
        </Text>
        <Text style={{ fontFamily: th.boldFont, fontSize: 23, color: '#ffffff', marginTop: 4 }}>
          {clean(basic.fullName) || 'Your Name'}
        </Text>
        <Text style={{ fontFamily: th.bodyFont, fontSize: 8.6, color: '#d5f5ee', marginTop: 6, lineHeight: 1.7 }}>
          {contact.join('   ·   ')}
        </Text>
      </View>

      <View style={{ paddingTop: 16, paddingRight: 34, paddingBottom: 34, paddingLeft: 34 }}>
        {clean(basic.summary) && (
          <View style={{ backgroundColor: '#f0fdff', borderWidth: 1, borderColor: '#a5f3fc', borderRadius: 4, paddingTop: 7, paddingRight: 10, paddingBottom: 7, paddingLeft: 10, marginBottom: 4 }}>
            <Text style={th.body}>{basic.summary}</Text>
          </View>
        )}

        {visibility.experience && experience.length > 0 && (
          <>
            <SectionTitle label="Experience" underline="accent" />
            {experience
              .filter((e) => clean(e.role) || clean(e.company) || e.bullets.some(clean))
              .map((exp) => (
                <View key={exp.id} style={{ marginBottom: 7 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ ...th.bold, fontSize: 10.6 }}>{clean(exp.role) || 'Role'}</Text>
                      <Text style={{ fontFamily: th.boldFont, fontSize: 9, color: th.accent }}>
                        {clean(exp.company)}
                        {clean(exp.company) && clean(exp.location) && <Text style={{ fontFamily: th.bodyFont, color: th.muted }}> · {exp.location}</Text>}
                      </Text>
                    </View>
                    <Text style={{ ...th.sm, fontSize: 8.4, fontFamily: 'Helvetica' }}>{dateRange(exp)}</Text>
                  </View>
                  {exp.bullets.filter(clean).map((b, i) => (
                    <Text key={i} style={{ ...th.body, marginTop: 1, paddingLeft: 9 }}>
                      {'\u2022  '}
                      {b}
                    </Text>
                  ))}
                </View>
              ))}
          </>
        )}

        {visibility.skills && skillGroups.some((g) => g.items.some(clean)) && (
          <>
            <SectionTitle label="Skills" underline="accent" />
            {skillGroups
              .filter((g) => g.items.some(clean))
              .map((g) => (
                <View key={g.id} style={{ flexDirection: 'row', marginBottom: 3 }}>
                  <Text style={{ width: 92, ...th.sm, fontSize: 7.8, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                    {clean(g.label) || 'Category'}
                  </Text>
                  <Text style={{ ...th.body, flex: 1, fontSize: th.bodySize - 0.2 }}>{g.items.filter(clean).join(', ')}</Text>
                </View>
              ))}
          </>
        )}

        {visibility.projects && projects.some((p) => clean(p.name) || clean(p.description)) && (
          <>
            <SectionTitle label="Projects" underline="accent" />
            {projects
              .filter((p) => clean(p.name) || clean(p.description))
              .map((p) => (
                <View key={p.id} style={{ marginBottom: 5 }}>
                  <Text style={{ ...th.bold, fontSize: 10 }}>
                    {clean(p.name)}
                    {clean(p.link) && <Text style={{ color: th.accent, fontFamily: th.bodyFont }}>  {p.link}</Text>}
                  </Text>
                  {clean(p.description) && <Text style={th.body}>{p.description}</Text>}
                </View>
              ))}
          </>
        )}

        {(visibility.education || visibility.certifications) && (
          <View style={{ flexDirection: 'row', marginTop: 2 }}>
            {visibility.education && education.some((e) => clean(e.degree) || clean(e.school)) && (
              <View style={{ flex: 1, marginRight: 7 }}>
                <SectionTitle label="Education" underline="accent" />
                {education
                  .filter((e) => clean(e.degree) || clean(e.school))
                  .map((e) => (
                    <View key={e.id} style={{ backgroundColor: '#f1f5f9', borderRadius: 3, paddingTop: 5, paddingRight: 8, paddingBottom: 5, paddingLeft: 8, marginBottom: 4 }}>
                      <Text style={{ ...th.bold, fontSize: 9.4 }}>{clean(e.degree) || 'Degree'}</Text>
                      <Text style={{ fontFamily: th.boldFont, fontSize: 8.4, color: th.accent }}>{clean(e.school)}</Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ ...th.sm, fontSize: 7.6 }}>{clean(e.focus)}</Text>
                        <Text style={{ ...th.sm, fontSize: 8 }}>{clean(e.gradYear)}</Text>
                      </View>
                    </View>
                  ))}
              </View>
            )}
            {visibility.certifications && certifications.some((c) => clean(c.name)) && (
              <View style={{ flex: 1 }}>
                <SectionTitle label="Certifications" underline="accent" />
                {certifications
                  .filter((c) => clean(c.name))
                  .map((c) => (
                    <View key={c.id} style={{ backgroundColor: '#f1f5f9', borderRadius: 3, paddingTop: 5, paddingRight: 8, paddingBottom: 5, paddingLeft: 8, marginBottom: 4 }}>
                      <Text style={{ ...th.bold, fontSize: 8.8 }}>{c.name}</Text>
                      <Text style={{ ...th.sm, fontSize: 7.8 }}>
                        {clean(c.issuer)}
                        {clean(c.issuer) && clean(c.year) ? ' · ' : ''}
                        {clean(c.year)}
                      </Text>
                    </View>
                  ))}
              </View>
            )}
          </View>
        )}
      </View>
    </Page>
  )
}

/* ------------------------------------------------------------------ */
/*  Tech Developer Standard                                            */
/* ------------------------------------------------------------------ */
function TechDoc({ data, t }) {
  const th = makeTheme(t)
  const { basic, experience, education, skillGroups, projects, certifications, visibility } = data
  const contact = [basic.email, basic.phone, basic.location, basic.linkedin, basic.portfolio].filter(clean)
  const RAIL = 158
  const MAIN = 324

  return (
    <Page size={A4} style={{ paddingTop: 32, paddingRight: 34, paddingBottom: 32, paddingLeft: 34 }}>
      {/* masthead */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottomWidth: 2, borderBottomColor: th.accent, paddingBottom: 8, marginBottom: 8 }}>
        <View>
          <Text style={{ fontFamily: th.boldFont, fontSize: 19, color: th.ink }}>{clean(basic.fullName) || 'Your Name'}</Text>
          {clean(basic.jobTitle) && <Text style={{ fontFamily: th.boldFont, fontSize: 9.6, color: th.accent }}>{basic.jobTitle}</Text>}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          {contact.map((c) => (
            <Text key={c} style={{ ...th.sm, fontSize: 7.8, marginBottom: 1 }}>
              {c}
            </Text>
          ))}
        </View>
      </View>

      {clean(basic.summary) && (
        <View style={{ borderLeftWidth: 2, borderLeftColor: th.accent, paddingLeft: 8, marginBottom: 6 }}>
          <Text style={{ ...th.body, fontSize: th.bodySize - 0.2 }}>{basic.summary}</Text>
        </View>
      )}

      <View style={{ flexDirection: 'row' }}>
        {/* main column */}
        <View style={{ width: MAIN }}>
          {visibility.experience && experience.length > 0 && (
            <>
              <SectionTitleTech label="Experience" />
              {experience
                .filter((e) => clean(e.role) || clean(e.company) || e.bullets.some(clean))
                .map((exp) => (
                  <View key={exp.id} style={{ marginBottom: 6 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <Text style={{ ...th.bold, fontSize: 9.9 }}>{clean(exp.role) || 'Role'}</Text>
                      <Text style={{ ...th.sm, fontSize: 7.6, fontFamily: 'Helvetica' }}>{dateRange(exp)}</Text>
                    </View>
                    <Text style={{ fontFamily: th.boldFont, fontSize: 8.6, color: th.accent }}>
                      {clean(exp.company)}
                      {clean(exp.company) && clean(exp.location) && <Text style={{ fontFamily: th.bodyFont, color: th.muted }}> — {exp.location}</Text>}
                    </Text>
                    {exp.bullets.filter(clean).map((b, i) => (
                      <Text key={i} style={{ ...th.body, fontSize: th.bodySize - 0.3, paddingLeft: 8, marginTop: 1 }}>
                        {'\u2022  '}
                        {b}
                      </Text>
                    ))}
                  </View>
                ))}
            </>
          )}

          {visibility.projects && projects.some((p) => clean(p.name) || clean(p.description)) && (
            <>
              <SectionTitleTech label="Projects" />
              {projects
                .filter((p) => clean(p.name) || clean(p.description))
                .map((p) => (
                  <View key={p.id} style={{ marginBottom: 4 }}>
                    <Text style={{ ...th.bold, fontSize: 9.4 }}>
                      {clean(p.name)}
                      {clean(p.link) && <Text style={{ color: '#1d4ed8', fontFamily: th.bodyFont, fontSize: 8 }}>  {p.link}</Text>}
                    </Text>
                    {clean(p.description) && <Text style={{ ...th.body, fontSize: th.bodySize - 0.2 }}>{p.description}</Text>}
                  </View>
                ))}
            </>
          )}
        </View>

        {/* side rail */}
        <View style={{ width: RAIL, marginLeft: 14, borderLeftWidth: 1, borderLeftColor: '#dbe2ea', paddingLeft: 12 }}>
          {visibility.skills && skillGroups.some((g) => g.items.some(clean)) && (
            <>
              <RailTitle label="Skills" accent={th.accent} />
              {skillGroups
                .filter((g) => g.items.some(clean))
                .map((g) => (
                  <View key={g.id} style={{ marginBottom: 4 }}>
                    <Text style={{ ...th.sm, fontSize: 7.4, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: th.boldFont }}>
                      {clean(g.label) || 'Category'}
                    </Text>
                    <Text style={{ ...th.sm, fontSize: 7.9, color: th.ink, marginTop: 1 }}>{g.items.filter(clean).join(', ')}</Text>
                  </View>
                ))}
            </>
          )}

          {visibility.education && education.some((e) => clean(e.degree) || clean(e.school)) && (
            <>
              <RailTitle label="Education" accent={th.accent} />
              {education
                .filter((e) => clean(e.degree) || clean(e.school))
                .map((e) => (
                  <View key={e.id} style={{ marginBottom: 5 }}>
                    <Text style={{ ...th.bold, fontSize: 8.8 }}>{clean(e.degree) || 'Degree'}</Text>
                    <Text style={{ ...th.sm, fontSize: 8 }}>{clean(e.school)}</Text>
                    <Text style={{ ...th.sm, fontSize: 7.4, color: th.accent }}>
                      {clean(e.gradYear) ? `Class of ${e.gradYear}` : ''}
                    </Text>
                    {clean(e.focus) && <Text style={{ ...th.sm, fontSize: 7.6 }}>{e.focus}</Text>}
                  </View>
                ))}
            </>
          )}

          {visibility.certifications && certifications.some((c) => clean(c.name)) && (
            <>
              <RailTitle label="Certifications" accent={th.accent} />
              {certifications
                .filter((c) => clean(c.name))
                .map((c) => (
                  <View key={c.id} style={{ marginBottom: 4 }}>
                    <Text style={{ ...th.bold, fontSize: 8 }}>{c.name}</Text>
                    <Text style={{ ...th.sm, fontSize: 7.6 }}>{clean(c.issuer)}</Text>
                  </View>
                ))}
            </>
          )}
        </View>
      </View>
    </Page>
  )
}

function SectionTitleTech({ label }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 7, marginBottom: 5 }}>
      <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8.2, color: '#334155', textTransform: 'uppercase', letterSpacing: 1.4 }}>
        {label}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: '#cbd5e1', marginLeft: 7 }} />
    </View>
  )
}

function RailTitle({ label, accent }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, marginTop: 4 }}>
      <View style={{ width: 2.5, height: 9, borderRadius: 2, backgroundColor: accent, marginRight: 4 }} />
      <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.6, color: accent, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </Text>
    </View>
  )
}

/* ------------------------------------------------------------------ */
/*  Executive Professional                                             */
/* ------------------------------------------------------------------ */
function ExecDoc({ data, t }) {
  const th = makeTheme(t)
  const { SectionTitle } = useSectionAPI(th)
  const { basic, experience, education, skillGroups, projects, certifications, visibility } = data
  const contact = [basic.phone, basic.email, basic.location, basic.linkedin, basic.portfolio].filter(clean)

  return (
    <Page size={A4} style={{ paddingTop: 44, paddingRight: 58, paddingBottom: 44, paddingLeft: 58 }}>
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontFamily: th.boldFont, fontSize: 25, color: th.ink, letterSpacing: 1 }}>
          {clean(basic.fullName) || 'Your Name'}
        </Text>
        {clean(basic.jobTitle) && (
          <Text style={{ fontFamily: th.boldFont, fontSize: 8.8, color: th.accent, textTransform: 'uppercase', letterSpacing: 2.6, marginTop: 4 }}>
            {basic.jobTitle}
          </Text>
        )}
        <View style={{ height: 0.5, backgroundColor: '#c7cdd6', alignSelf: 'stretch', marginTop: 9 }} />
        {contact.length > 0 && (
          <Text style={{ ...th.sm, fontSize: 7.6, textTransform: 'uppercase', letterSpacing: 1.1, marginTop: 7, color: th.muted }}>
            {contact.join('   ·   ')}
          </Text>
        )}
        <View style={{ height: 0.5, backgroundColor: '#c7cdd6', alignSelf: 'stretch', marginTop: 9 }} />
      </View>

      {clean(basic.summary) && (
        <>
          <SectionTitle label="Profile" centered />
          <Text style={{ ...th.italic, ...th.body, textAlign: 'center' }}>{basic.summary}</Text>
        </>
      )}

      {visibility.experience && experience.length > 0 && (
        <>
          <SectionTitle label="Professional Experience" centered />
          {experience
            .filter((e) => clean(e.role) || clean(e.company) || e.bullets.some(clean))
            .map((exp) => (
              <View key={exp.id} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={{ fontFamily: th.boldFont, fontSize: 11.2 }}>
                    {clean(exp.role) || 'Role'}
                    {clean(exp.role) && clean(exp.company) && <Text style={{ color: th.accent, fontFamily: th.bodyFont }}> · {exp.company}</Text>}
                  </Text>
                  <Text style={{ ...th.sm, fontSize: 7.6, textTransform: 'uppercase', letterSpacing: 0.8 }}>{dateRange(exp)}</Text>
                </View>
                {clean(exp.location) && (
                  <Text style={{ ...th.sm, fontSize: 7.4, textTransform: 'uppercase', letterSpacing: 1.2 }}>{exp.location}</Text>
                )}
                {exp.bullets.filter(clean).map((b, i) => (
                  <Text key={i} style={{ ...th.body, fontSize: th.bodySize - 0.2, paddingLeft: 12, marginTop: 1.5 }}>
                    {'\u2013  '}
                    {b}
                  </Text>
                ))}
              </View>
            ))}
        </>
      )}

      {visibility.projects && projects.some((p) => clean(p.name) || clean(p.description)) && (
        <>
          <SectionTitle label="Selected Projects" centered />
          {projects
            .filter((p) => clean(p.name) || clean(p.description))
            .map((p) => (
              <View key={p.id} style={{ marginBottom: 5 }}>
                <Text style={{ ...th.bold, fontSize: 10.4 }}>
                  {clean(p.name)}
                  {clean(p.link) && <Text style={{ color: '#1d4ed8', fontFamily: th.bodyFont, fontSize: 8.4 }}>  {p.link}</Text>}
                </Text>
                {clean(p.description) && <Text style={th.body}>{p.description}</Text>}
              </View>
            ))}
        </>
      )}

      <View style={{ flexDirection: 'row' }}>
        {visibility.education && education.some((e) => clean(e.degree) || clean(e.school)) && (
          <View style={{ flex: 1, marginRight: 11 }}>
            <SectionTitle label="Education" centered />
            {education
              .filter((e) => clean(e.degree) || clean(e.school))
              .map((e) => (
                <View key={e.id} style={{ alignItems: 'center', marginBottom: 5 }}>
                  <Text style={{ ...th.bold, fontSize: 10 }}>{clean(e.degree) || 'Degree'}</Text>
                  <Text style={{ ...th.sm, fontSize: 8.6 }}>
                    {clean(e.school)}
                    {clean(e.school) && clean(e.gradYear) ? ` · ${e.gradYear}` : clean(e.gradYear)}
                  </Text>
                  {clean(e.focus) && <Text style={{ ...th.italic, ...th.sm, fontSize: 8 }}>{e.focus}</Text>}
                </View>
              ))}
          </View>
        )}
        {visibility.certifications && certifications.some((c) => clean(c.name)) && (
          <View style={{ flex: 1 }}>
            <SectionTitle label="Certifications" centered />
            {certifications
              .filter((c) => clean(c.name))
              .map((c) => (
                <Text key={c.id} style={{ ...th.sm, fontSize: 8.8, textAlign: 'center', marginBottom: 3 }}>
                  {c.name}
                  {clean(c.issuer) && <Text style={{ color: th.muted }}> — {c.issuer}</Text>}
                </Text>
              ))}
          </View>
        )}
      </View>

      {visibility.skills && skillGroups.some((g) => g.items.some(clean)) && (
        <>
          <SectionTitle label="Core Competencies" centered />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {skillGroups
              .filter((g) => g.items.some(clean))
              .map((g) => (
                <View key={g.id} style={{ width: '50%', flexDirection: 'row', marginBottom: 3 }}>
                  <Text style={{ width: 100, ...th.sm, fontSize: 7.4, textTransform: 'uppercase', letterSpacing: 0.7, fontFamily: th.boldFont }}>
                    {clean(g.label) || 'Category'}
                  </Text>
                  <Text style={{ ...th.sm, fontSize: 8.4, color: th.ink, flex: 1 }}>{g.items.filter(clean).join(', ')}</Text>
                </View>
              ))}
          </View>
        </>
      )}
    </Page>
  )
}

/* ------------------------------------------------------------------ */
/*  ATS Studio Two-Column                                             */
/* ------------------------------------------------------------------ */
function AtsStudioDoc({ data, t }) {
  const { basic, experience, education, websites = [], skillGroups, hobbies = [], visibility = {}, formatting = {} } = data
  const accent = formatting.accentColor || t.accent || '#244CEC'
  const isLetter = formatting.canvasDimensions === 'Letter'
  const pageSize = isLetter ? { width: 612, height: 792 } : A4

  return (
    <Page size={pageSize} style={{ paddingTop: 34, paddingRight: 36, paddingBottom: 34, paddingLeft: 36, fontFamily: 'Helvetica', color: '#1A1A1A' }}>
      {/* Header with Avatar & Name */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 12, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: `${accent}40` }}>
        {!basic.hidePhotoForAts && (
          clean(basic.avatar) ? (
            <Image src={basic.avatar} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 14 }} />
          ) : (
            <View style={{ width: 46, height: 46, borderRadius: 23, borderWidth: 1.5, borderColor: accent, alignItems: 'center', justifyContent: 'center', marginRight: 14, backgroundColor: '#FBF9F5' }}>
              <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', color: accent }}>
                {clean(basic.fullName) ? clean(basic.fullName).charAt(0).toUpperCase() : 'R'}
              </Text>
            </View>
          )
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 21, fontFamily: 'Helvetica-Bold', color: '#1A1A1A', letterSpacing: -0.2 }}>
            {clean(basic.fullName) || 'Your Name'}
          </Text>
          {clean(basic.jobTitle) && (
            <Text style={{ fontSize: 9.8, fontFamily: 'Helvetica-Bold', color: accent, textTransform: 'uppercase', letterSpacing: 1.2, marginTop: 2 }}>
              {basic.jobTitle}
            </Text>
          )}
        </View>
      </View>

      {/* Two Column Grid */}
      <View style={{ flexDirection: 'row' }}>
        {/* Left Column */}
        <View style={{ width: 175, paddingRight: 14, borderRightWidth: 1, borderRightColor: '#E8E4DC' }}>
          {/* Contact Details */}
          {(clean(basic.email) || clean(basic.phone) || clean(basic.location) || websites.length > 0) && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, paddingBottom: 2, borderBottomWidth: 1, borderBottomColor: `${accent}30` }}>
                Contact
              </Text>
              {clean(basic.email) && <Text style={{ fontSize: 7.8, color: '#2D2D2D', marginBottom: 2 }}>{basic.email}</Text>}
              {clean(basic.phone) && <Text style={{ fontSize: 7.8, color: '#2D2D2D', marginBottom: 2 }}>{basic.phone}</Text>}
              {clean(basic.location) && <Text style={{ fontSize: 7.8, color: '#2D2D2D', marginBottom: 2 }}>{basic.location}</Text>}
              {websites.map((w) => clean(w.url) && (
                <Text key={w.id} style={{ fontSize: 7.4, color: '#555', marginBottom: 1.5 }}>
                  {clean(w.label) ? `${w.label}: ` : ''}{w.url}
                </Text>
              ))}
            </View>
          )}

          {/* Education */}
          {visibility.education !== false && education.some((e) => clean(e.degree) || clean(e.school)) && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, paddingBottom: 2, borderBottomWidth: 1, borderBottomColor: `${accent}30` }}>
                Education
              </Text>
              {education.filter((e) => clean(e.degree) || clean(e.school)).map((edu) => (
                <View key={edu.id} style={{ marginBottom: 5 }}>
                  <Text style={{ fontSize: 8.2, fontFamily: 'Helvetica-Bold', color: '#1A1A1A' }}>{clean(edu.degree) || 'Degree'}</Text>
                  <Text style={{ fontSize: 7.8, fontFamily: 'Helvetica-Bold', color: accent }}>{clean(edu.school)}</Text>
                  {clean(edu.gradYear) && <Text style={{ fontSize: 7.2, color: '#666' }}>{edu.gradYear}</Text>}
                  {clean(edu.focus) && <Text style={{ fontSize: 7.2, fontStyle: 'italic', color: '#666' }}>{edu.focus}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Skills */}
          {visibility.skills !== false && skillGroups.some((g) => g.items.some(clean)) && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, paddingBottom: 2, borderBottomWidth: 1, borderBottomColor: `${accent}30` }}>
                Skills & Tools
              </Text>
              {skillGroups.filter((g) => g.items.some(clean)).map((g) => (
                <View key={g.id} style={{ marginBottom: 3.5 }}>
                  {clean(g.label) && <Text style={{ fontSize: 7.4, fontFamily: 'Helvetica-Bold', color: '#555', textTransform: 'uppercase' }}>{g.label}</Text>}
                  <Text style={{ fontSize: 7.5, color: '#1A1A1A', marginTop: 1 }}>{g.items.filter(clean).join(', ')}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Hobbies */}
          {visibility.hobbies !== false && hobbies.some((h) => clean(h.name)) && (
            <View>
              <Text style={{ fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, paddingBottom: 2, borderBottomWidth: 1, borderBottomColor: `${accent}30` }}>
                Hobbies
              </Text>
              <Text style={{ fontSize: 7.4, color: '#444' }}>
                {hobbies.filter((h) => clean(h.name)).map((h) => h.name).join('  ·  ')}
              </Text>
            </View>
          )}
        </View>

        {/* Right Column */}
        <View style={{ flex: 1, paddingLeft: 16 }}>
          {/* Summary */}
          {clean(basic.summary) && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, paddingBottom: 2, borderBottomWidth: 1, borderBottomColor: `${accent}30` }}>
                Profile Summary
              </Text>
              <Text style={{ fontSize: 8.3, lineHeight: 1.45, color: '#2D2D2D' }}>
                {basic.summary}
              </Text>
            </View>
          )}

          {/* Employment History */}
          {visibility.experience !== false && experience.length > 0 && (
            <View>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5, paddingBottom: 2, borderBottomWidth: 1, borderBottomColor: `${accent}30` }}>
                Employment History
              </Text>
              {experience.filter((e) => clean(e.role) || clean(e.company) || e.bullets.some(clean)).map((exp) => (
                <View key={exp.id} style={{ marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Text style={{ fontSize: 8.8, fontFamily: 'Helvetica-Bold', color: '#1A1A1A' }}>{clean(exp.role) || 'Role'}</Text>
                    <Text style={{ fontSize: 7.4, color: '#666' }}>{dateRange(exp)}</Text>
                  </View>
                  <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: accent, marginTop: 1 }}>
                    {clean(exp.company)}
                    {clean(exp.location) ? ` — ${exp.location}` : ''}
                  </Text>
                  {exp.bullets.filter(clean).map((b, i) => (
                    <Text key={i} style={{ fontSize: 7.8, color: '#2D2D2D', lineHeight: 1.4, marginTop: 1.5, paddingLeft: 7 }}>
                      {'\u2022  '}{b}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </Page>
  )
}

/* ------------------------------------------------------------------ */

const BUILDERS = { 'ats-studio': AtsStudioDoc, classic: ClassicDoc, cyber: CyberDoc, tech: TechDoc, exec: ExecDoc }

export function ResumeDocument({ resume }) {
  const baseTheme = PDF_THEMES[resume.templateId] || PDF_THEMES['ats-studio'] || PDF_THEMES.classic
  const theme = {
    ...baseTheme,
    ...(resume.formatting?.accentColor ? { accent: resume.formatting.accentColor } : {}),
  }
  const Builder = BUILDERS[theme.id] || AtsStudioDoc || ClassicDoc
  return (
    <Document title={`${resume.basic.fullName || 'Resume'} — Resume`} producer="resume.io ATS Studio" creator="resume.io">
      <Builder data={resume} t={theme} />
    </Document>
  )
}
