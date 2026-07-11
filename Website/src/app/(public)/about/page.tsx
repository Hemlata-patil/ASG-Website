import React from 'react';
import PageWrapper from '@/components/layout/PageWrapper/PageWrapper';
import PartnerLogoStrip from './PartnerLogoStrip';

const values = [
  {
    title: 'Founder-first community',
    text: 'ASG brings founders, mentors, service providers, and student builders into one practical startup network for Jalgaon and North Maharashtra.',
  },
  {
    title: 'Industry-aligned learning',
    text: 'AAL helps students build real products with expert guidance across product, design, AI, web development, and go-to-market thinking.',
  },
  {
    title: 'Local execution, global standards',
    text: 'We focus on production-ready work, disciplined collaboration, and strong feedback loops between startups, students, and industry partners.',
  },
];

const team = [
  { name: 'APEX Startup Group', role: 'Ecosystem Builder' },
  { name: 'AAL Mentors', role: 'Industry Guidance' },
  { name: 'ASG Partners', role: 'Startup Enablement' },
];

export default function AboutPage() {
  return (
    <PageWrapper>
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <span className="label" style={{ color: 'var(--apex-primary)', marginBottom: 'var(--space-2)', display: 'block' }}>
            ABOUT APEX
          </span>
          <h1 className="display-xl" style={{ color: 'var(--apex-text-white)', marginBottom: 'var(--space-3)' }}>
            Building Jalgaon&apos;s Startup Ecosystem
          </h1>
          <div style={{ width: '80px', height: '3px', borderRadius: '999px', background: 'var(--apex-primary)', margin: '0 auto var(--space-4)' }} />
          <p className="body-lg" style={{ color: 'var(--apex-text-muted)', maxWidth: '820px', margin: '0 auto' }}>
            APEX Startup Group connects early-stage founders, students, mentors, investors, and industry partners through community programs, live projects, expert sessions, and cohort-based execution.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--apex-bg-surface-elevated)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }} className="grid-3">
            {values.map((item) => (
              <article key={item.title} style={{ background: 'var(--apex-bg-surface)', border: '1px solid var(--apex-border-dark)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', boxShadow: 'var(--shadow-sm)' }}>
                <h2 className="heading-sm" style={{ color: 'var(--apex-text-white)', marginBottom: 'var(--space-2)' }}>{item.title}</h2>
                <p className="body-sm" style={{ color: 'var(--apex-text-muted)', margin: 0 }}>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="label" style={{ color: 'var(--apex-primary)', marginBottom: 'var(--space-2)', display: 'block' }}>
            COLLABORATION
          </span>
          <h2 className="display-md" style={{ color: 'var(--apex-text-white)', marginBottom: 'var(--space-3)' }}>
            Our Industry Partners
          </h2>
          <div style={{ width: '72px', height: '3px', borderRadius: '999px', background: 'var(--apex-primary)', margin: '0 auto var(--space-5)' }} />
          <PartnerLogoStrip />
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--apex-border-dark)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', alignItems: 'center' }} className="grid-2">
            <div>
              <span className="label" style={{ color: 'var(--apex-primary)', marginBottom: 'var(--space-2)', display: 'block' }}>
                TEAM MODEL
              </span>
              <h2 className="display-md" style={{ color: 'var(--apex-text-white)', marginBottom: 'var(--space-3)' }}>
                A community operated around real outcomes.
              </h2>
              <p className="body-md" style={{ color: 'var(--apex-text-muted)' }}>
                The APEX platform is shaped by operators, mentors, local founders, and student builders who work together to convert ideas into deployable products and stronger businesses.
              </p>
            </div>
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              {team.map((item) => (
                <div key={item.name} style={{ background: 'var(--apex-bg-surface)', border: '1px solid var(--apex-border-dark)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
                  <strong style={{ color: 'var(--apex-text-white)', display: 'block', marginBottom: '4px' }}>{item.name}</strong>
                  <span style={{ color: 'var(--apex-primary)', fontWeight: 700 }}>{item.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
