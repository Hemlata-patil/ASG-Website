import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper/PageWrapper';
import SectionHeading from '../components/common/SectionHeading/SectionHeading';
import { asgMembers, aalInterns } from '../data/listingsData';
import { domains } from '../data/domains';
import ApexDropdown from '../components/common/ApexDropdown/ApexDropdown';

export default function Listings() {
  const { type } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Resolve standard types
  const validTypes = ['founders', 'mentors', 'investors', 'service-providers', 'interns'];
  const currentType = validTypes.includes(type) ? type : 'founders';

  // State for project filter (applicable for interns only)
  const initialProject = searchParams.get('project') || 'all';
  const [selectedProject, setSelectedProject] = useState(initialProject);

  useEffect(() => {
    const projectInUrl = searchParams.get('project');
    if (projectInUrl) {
      setSelectedProject(projectInUrl);
    } else {
      setSelectedProject('all');
    }
  }, [searchParams]);

  // Headers metadata
  const metaMap = {
    founders: {
      overline: "ASG Ecosystem Nodes",
      title: "Ecosystem Founders",
      subtitle: "Meet our early-stage builders, product innovators, and tech visionaries actively running companies."
    },
    mentors: {
      overline: "ASG Ecosystem Nodes",
      title: "Domain Mentors",
      subtitle: "Meet our domain experts, legal advisors, marketing specialists, and tech leads guiding builders."
    },
    investors: {
      overline: "ASG Ecosystem Nodes",
      title: "Angel Investors",
      subtitle: "Meet our angel syndicates, corporate leaders, and VC partners seeking regional technology investments."
    },
    "service-providers": {
      overline: "ASG Ecosystem Nodes",
      title: "Service Providers",
      subtitle: "Meet our validated legal, chartered accountant, tech consulting, design agency, and server hosting partners."
    },
    interns: {
      overline: "AAL Talent Pool",
      title: "Active Intern Cohorts",
      subtitle: "Explore our cross-functional squads containing web devs, PMs, and designers working on startup prototypes."
    }
  };

  const currentMeta = metaMap[currentType];

  const handleProjectFilterChange = (val) => {
    setSelectedProject(val);
    if (val === 'all') {
      searchParams.delete('project');
    } else {
      searchParams.set('project', val);
    }
    setSearchParams(searchParams);
  };

  // Get data to display
  let displayData = [];
  if (currentType === 'interns') {
    if (selectedProject === 'all') {
      // Flatten all interns
      Object.keys(aalInterns).forEach(projId => {
        const projName = domains.find(d => d.id === projId)?.name || projId;
        aalInterns[projId].forEach(intern => {
          displayData.push({ ...intern, project: projName, projectId: projId });
        });
      });
    } else {
      const projName = domains.find(d => d.id === selectedProject)?.name || selectedProject;
      const internsForProj = aalInterns[selectedProject] || [];
      displayData = internsForProj.map(intern => ({ ...intern, project: projName, projectId: selectedProject }));
    }
  } else {
    displayData = asgMembers[currentType] || [];
  }

  // Resolve currently selected project name
  const currentProjectName = selectedProject === 'all' ? 'All Projects' : (domains.find(d => d.id === selectedProject)?.name || selectedProject);

  return (
    <PageWrapper>
      <section className="section" style={{ borderBottom: '1px solid var(--apex-border-dark)', minHeight: '80vh' }}>
        <div className="container">
          {/* Back button */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <Link 
              to={currentType === 'interns' ? '/aal' : '/asg'} 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--apex-primary)',
                fontWeight: '600',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'transform var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <ArrowLeft size={16} /> Back to {currentType === 'interns' ? 'APEX AI Launchpad (AAL)' : 'ASG Page'}
            </Link>
          </div>

          {/* Section heading */}
          <SectionHeading 
            overline={currentMeta.overline}
            title={currentMeta.title}
            subtitle={currentMeta.subtitle}
          />

          {/* Filters for interns */}
          {currentType === 'interns' && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              marginBottom: 'var(--space-5)',
              backgroundColor: 'var(--apex-bg-surface-elevated)',
              padding: '12px 24px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--apex-border-dark)',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              <Filter size={18} color="var(--apex-primary)" />
              <label style={{ color: 'var(--apex-text-white)', fontWeight: '600', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                Filter by Project:
              </label>
              <ApexDropdown
                label={currentProjectName}
                options={[
                  { value: 'all', label: 'All Projects' },
                  ...domains.map((d) => ({ value: d.id, label: d.name }))
                ]}
                onSelect={handleProjectFilterChange}
                minWidth="200px"
              />
            </div>
          )}


          {/* Listings Grid */}
          {displayData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6) 0', color: 'var(--apex-text-muted)' }}>
              No members found in this category.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-4)'
            }} className="grid-3">
              {displayData.map((member, idx) => (
                <div 
                  key={member.id || member.name + idx}
                  style={{
                    backgroundColor: 'var(--apex-bg-surface)',
                    border: '1px solid var(--apex-border-dark)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'border-color var(--transition-base), transform var(--transition-base), box-shadow var(--transition-base)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--apex-primary)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-glow-orange-sm)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--apex-border-dark)';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  {/* Photo with beautiful avatar border styling */}
                  <div style={{ position: 'relative', marginBottom: 'var(--space-3)' }}>
                    <div style={{
                      position: 'absolute',
                      top: '-4px',
                      left: '-4px',
                      right: '-4px',
                      bottom: '-4px',
                      background: 'linear-gradient(135deg, var(--apex-primary), var(--apex-primary-warm))',
                      borderRadius: '50%',
                      zIndex: 1
                    }} />
                    <img 
                      src={member.photo} 
                      alt={member.name}
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        position: 'relative',
                        zIndex: 2,
                        border: '3px solid var(--apex-bg-surface)'
                      }}
                    />
                  </div>

                  <h3 className="heading-sm" style={{ color: 'var(--apex-text-white)', marginBottom: '6px', fontSize: '1.2rem' }}>
                    {member.name}
                  </h3>

                  {currentType !== 'interns' ? (
                    <>
                      <p className="body-sm" style={{ color: 'var(--apex-primary-warm)', fontWeight: '600', marginBottom: '4px' }}>
                        {member.role}
                      </p>
                      <p className="body-sm" style={{ color: 'var(--apex-text-muted)', margin: 0 }}>
                        {member.company}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="body-sm" style={{ color: 'var(--apex-text-white)', fontWeight: '500', fontSize: '0.85rem', margin: '2px 0' }}>
                        🏫 {member.college}
                      </p>
                      <p className="body-sm" style={{ color: 'var(--apex-text-muted)', fontSize: '0.8rem', margin: '2px 0' }}>
                        <strong>Course:</strong> {member.course}
                      </p>
                      <p className="body-sm" style={{ color: 'var(--apex-text-muted)', fontSize: '0.8rem', margin: '2px 0 8px 0' }}>
                        <strong>Year:</strong> {member.year}
                      </p>
                      <span style={{
                        fontSize: '0.75rem',
                        backgroundColor: 'rgba(255, 90, 20, 0.1)',
                        color: 'var(--apex-primary)',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: '700',
                        display: 'inline-block'
                      }}>
                        Project: {member.project}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
