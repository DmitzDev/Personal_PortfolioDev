import React, { useState, useCallback, lazy, Suspense } from 'react';
import { IntroLoader } from './components/IntroLoader/IntroLoader';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';

const Projects = lazy(() => import('./components/Projects/Projects').then(m => ({ default: m.Projects })));
const Skills = lazy(() => import('./components/Skills/Skills').then(m => ({ default: m.Skills })));
const Services = lazy(() => import('./components/Services/Services').then(m => ({ default: m.Services })));
const Experience = lazy(() => import('./components/Experience/Experience').then(m => ({ default: m.Experience })));
const Contact = lazy(() => import('./components/Contact/Contact').then(m => ({ default: m.Contact })));
const Footer = lazy(() => import('./components/Footer/Footer').then(m => ({ default: m.Footer })));
import { ScrollToTop } from './components/shared/ScrollToTop';
import { Toaster } from 'sonner';
import { useLenis } from './hooks/useLenis';
import { useTheme } from './hooks/useTheme';
import './index.css';

function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const { theme, changeTheme } = useTheme();

  useLenis();

  const handleReveal = useCallback(() => {
    changeTheme('light');
  }, [changeTheme]);

  const handleFinish = useCallback(() => {
    setIntroFinished(true);
    changeTheme('light');
  }, [changeTheme]);

  return (
    <div className="app-container">
      <Toaster
        theme={theme}
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          },
        }}
      />

      {!introFinished && (
        <IntroLoader onReveal={handleReveal} onFinish={handleFinish} />
      )}
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <Projects />
          <Skills />
          <Services />
          <Experience />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <ScrollToTop />
    </div>
  );
}

export default App;
