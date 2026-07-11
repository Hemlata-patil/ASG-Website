'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getPartnersAction, type PartnerRecord } from '@/app/actions/partners';

export default function PartnerLogoStrip() {
  const [partners, setPartners] = useState<PartnerRecord[]>([]);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        setPartners(await getPartnersAction({ publicOnly: true }));
      } catch (error) {
        console.error('Failed to load partner logos', error);
      }
    };

    void loadPartners();
  }, []);

  const marqueeItems = useMemo(() => [...partners, ...partners], [partners]);

  if (partners.length === 0) {
    return (
      <p className="body-sm" style={{ color: 'var(--apex-text-muted)', margin: 0 }}>
        Approved partner logos will appear here.
      </p>
    );
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%', padding: '32px 0' }}>
      <style jsx>{`
        @keyframes partnerMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .partner-track {
          display: flex;
          width: max-content;
          gap: 72px;
          animation: partnerMarquee 26s linear infinite;
        }

        .partner-track:hover {
          animation-play-state: paused;
        }

        .partner-logo {
          filter: grayscale(1);
          opacity: 0.58;
          transform: translateY(0) scale(1);
          transition: filter 180ms ease, opacity 180ms ease, transform 180ms ease, box-shadow 180ms ease;
        }

        .partner-logo:hover {
          filter: grayscale(0);
          opacity: 1;
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 18px 40px rgba(255, 107, 0, 0.16);
        }
      `}</style>
      <div className="partner-track">
        {marqueeItems.map((partner, index) => (
          <a
            key={`${partner.id}-${index}`}
            className="partner-logo"
            href={partner.websiteUrl || partner.website || '#'}
            target="_blank"
            rel="noreferrer"
            aria-label={`${partner.name} website`}
            style={{ width: '180px', height: '96px', borderRadius: '18px', background: '#fff', border: '1px solid var(--apex-border-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '18px', textDecoration: 'none', flex: '0 0 auto' }}
          >
            {partner.logo ? (
              <img src={partner.logo} alt={partner.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ color: 'var(--apex-text-white)', fontWeight: 800 }}>{partner.name}</span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
