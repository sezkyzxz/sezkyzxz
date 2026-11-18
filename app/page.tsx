'use client';

import dynamic from 'next/dynamic';
import PageLoader from '@/components/PageLoader';

const PortfolioExperience = dynamic(
  () => import('@/components/PortfolioExperience'),
  {
    ssr: false,
    loading: () => <PageLoader />,
  }
);

export default function HomePage() {
  return <PortfolioExperience />;
}