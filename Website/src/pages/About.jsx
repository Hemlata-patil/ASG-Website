import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper/PageWrapper';
import SectionHeading from '../components/common/SectionHeading/SectionHeading';
import { team } from '../data/team';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import simplesphereLogo from '../assets/simplesphere.png';
import aspireyaLogo from '../assets/aspireya.png';
import logicPointLogo from '../assets/logic_point.png';
import utLogo from '../assets/ut_logo.png';
import { partnersData } from '../data/partners';

export default function About() {
  const originAnim = useScrollAnimation();
  const missionAnim = useScrollAnimation();
  const teamAnim = useScrollAnimation();
  const partnersAnim = useScrollAnimation();

  const [partners, setPartners] = useState(() => {
    const local = localStorage.getItem('asg_partners');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return partnersData;
      }
    }
    localStorage.setItem('asg_partners', JSON.stringify(partnersData));
    return partnersData;
  });

  const activePartners = partners.filter(p => p.status === 'Active' && p.showOnWebsite);

  return (
    <PageWrapper>
      {/* Origin Story */}
      <section ref={originAnim.ref} className={`section ${originAnim.className}`}>
        <div className="container">
          <SectionHeading
            overline="Our Background"
            title="How APEX Began"
            subtitle="The origin story of Jalgaon's largest tech, student, and founder collective."
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: 'var(--space-6)',
            alignItems: 'center'
          }} className="grid-2">
            <div>
              <p className="body-md" style={{ color: 'var(--apex-text-white)', marginBottom: 'var(--space-3)' }}>
                Founded in Jalgaon, APEX Startup Group (ASG) began as a series of informal weekend chats between founders, tech leads, and academic advisors looking to build scalable tech solutions locally.
              </p>
              <p className="body-md" style={{ color: 'var(--apex-text-muted)', marginBottom: 'var(--space-3)' }}>
                We noticed a prominent pattern: while our local engineering students had theoretical knowledge, they lacked practical, hands-on framework exposure. Conversely, early-stage founders lacked structured mentor access and tech pipelines to test prototypes.
              </p>
              <p className="body-md" style={{ color: 'var(--apex-text-muted)' }}>
                To solve this, we launched the **APEX AI Launchpad (AAL)** internship. Today, APEX represents a unified platform housing our dual efforts—bridging industry talent with growth circles.
              </p>
            </div>

            {/* Visual Grid / Masked Bento */}
            <div style={{
              backgroundColor: 'var(--apex-bg-surface)',
              border: '1px solid var(--apex-border-dark)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 className="heading-sm" style={{ color: 'var(--apex-primary)', marginBottom: '8px' }}>Grassroots Innovation</h3>
              <p className="body-sm" style={{ color: 'var(--apex-text-muted)', marginBottom: 'var(--space-3)' }}>
                We believe Tier 2/3 cities are hubs of raw engineering potential.
              </p>
              <div style={{ fontSize: '3rem' }}>🌱🚀📈</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision (Light mode elevated surface layout) */}
      <section ref={missionAnim.ref} className={`section ${missionAnim.className}`} style={{ backgroundColor: 'var(--apex-bg-surface-elevated)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }} className="grid-2">
            {/* Mission */}
            <div style={{
              backgroundColor: 'var(--apex-bg-surface)',
              border: '1px solid var(--apex-border-dark)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 className="heading-md" style={{ color: 'var(--apex-primary)', marginBottom: 'var(--space-3)' }}>Our Mission</h3>
              <p className="body-md" style={{ color: 'var(--apex-text-white)' }}>
                To democratize access to industry-grade technical skills, structure peer networks for local entrepreneurs, and reduce regional brain drain by fostering innovation directly inside Jalgaon.
              </p>
            </div>

            {/* Vision */}
            <div style={{
              backgroundColor: 'var(--apex-bg-surface)',
              border: '1px solid var(--apex-border-dark)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 className="heading-md" style={{ color: 'var(--apex-primary)', marginBottom: 'var(--space-3)' }}>Our Vision</h3>
              <p className="body-md" style={{ color: 'var(--apex-text-white)' }}>
                To position North Maharashtra as a self-sustaining innovation hub, where students build global-quality code and startup founders find immediate funding, legal, and operational support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Industry Partners Section with Infinite Scroll Marquee */}
      <section ref={partnersAnim.ref} className={`section ${partnersAnim.className}`} style={{ backgroundColor: 'transparent' }}>
        <div className="container">
          <SectionHeading
            overline="Collaboration"
            title="Our Industry Partners"
          />

          <div className="marquee-container">
            <div className="marquee-track">
              {/* Set 1 */}
              <div className="partner-logo-item simplesphere">
                <img src={simplesphereLogo} alt="SimpleSphere" />
              </div>
              <div className="partner-logo-item logicpoint">
                <img src={logicPointLogo} alt="Logic Point" />
              </div>
              <div className="partner-logo-item ut">
                <img src={utLogo} alt="UT" />
              </div>
              <div className="partner-logo-item aspireya">
                <img src={aspireyaLogo} alt="Aspireya" />
              </div>

              {/* Set 2 */}
              <div className="partner-logo-item simplesphere">
                <img src={simplesphereLogo} alt="SimpleSphere" />
              </div>
              <div className="partner-logo-item logicpoint">
                <img src={logicPointLogo} alt="Logic Point" />
              </div>
              <div className="partner-logo-item ut">
                <img src={utLogo} alt="UT" />
              </div>
              <div className="partner-logo-item aspireya">
                <img src={aspireyaLogo} alt="Aspireya" />
              </div>

              {/* Set 3 */}
              <div className="partner-logo-item simplesphere">
                <img src={simplesphereLogo} alt="SimpleSphere" />
              </div>
              <div className="partner-logo-item logicpoint">
                <img src={logicPointLogo} alt="Logic Point" />
              </div>
              <div className="partner-logo-item ut">
                <img src={utLogo} alt="UT" />
              </div>
              <div className="partner-logo-item aspireya">
                <img src={aspireyaLogo} alt="Aspireya" />
              </div>

              {/* Set 4 */}
              <div className="partner-logo-item simplesphere">
                <img src={simplesphereLogo} alt="SimpleSphere" />
              </div>
              <div className="partner-logo-item logicpoint">
                <img src={logicPointLogo} alt="Logic Point" />
              </div>
              <div className="partner-logo-item ut">
                <img src={utLogo} alt="UT" />
              </div>
              <div className="partner-logo-item aspireya">
                <img src={aspireyaLogo} alt="Aspireya" />
              </div>
            </div>
          </div>

          {/* Active Partners Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-5)'
          }}>
            {activePartners.map((partner) => (
              <div
                key={partner.id}
                style={{
                  backgroundColor: 'var(--apex-bg-surface)',
                  border: '1px solid var(--apex-border-dark)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all var(--transition-base)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--apex-primary)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--apex-border-dark)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '2rem' }}>{partner.logo}</div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'var(--apex-primary)',
                    backgroundColor: 'rgba(255,107,0,0.1)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {partner.category}
                  </span>
                </div>
                <h4 className="heading-sm" style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#fff' }}>{partner.name}</h4>
                <p className="body-sm" style={{ color: 'var(--apex-text-muted)', marginBottom: '12px', lineHeight: '1.4' }}>{partner.description}</p>
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    color: 'var(--apex-primary)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Visit Website ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

