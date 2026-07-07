'use client';

import { useEffect } from 'react';

export default function AdminRedirect() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      if (origin.includes("3000")) {
        window.location.href = origin.replace("3000", "3001");
      } else if (origin.includes("5173")) {
        window.location.href = origin.replace("5173", "5174");
      } else {
        window.location.href = "http://localhost:3001";
      }
    }
  }, []);

  return (
    <div style={{ color: '#fff', textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
      Redirecting to Admin Portal...
    </div>
  );
}
