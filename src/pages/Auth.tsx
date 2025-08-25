import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LandingNavbar } from '@/components/LandingNavbar';
import { AuthModal } from '@/components/AuthModal';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { SolutionSection } from '@/components/landing/SolutionSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { Footer } from '@/components/landing/Footer';

const Auth = () => {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleGetStarted = () => {
    setAuthModalOpen(true);
  };

  return (
    <>
      <LandingNavbar onSignInClick={() => setAuthModalOpen(true)} />
      
      <div className="min-h-screen bg-gradient-dark">
        <HeroSection onGetStarted={handleGetStarted} />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <Footer onGetStarted={handleGetStarted} />
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};

export default Auth;