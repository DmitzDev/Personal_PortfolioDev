import React, { useState } from 'react';
import { IntroLoader } from './components/IntroLoader/IntroLoader';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { Projects } from './components/Projects/Projects';
import { Skills } from './components/Skills/Skills';
import { Services } from './components/Services/Services';
import { Experience } from './components/Experience/Experience';
import { Contact } from './components/Contact/Contact';
import { Footer } from './components/Footer/Footer';
import { ScrollToTop } from './components/shared/ScrollToTop';
import { Toaster } from 'sonner';
import { useLenis } from './hooks/useLenis';
import { useTheme } from './hooks/useTheme';
import './index.css';

function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const { theme } = useTheme();

  // Initialize smooth momentum scrolling
  useLenis();

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
        <IntroLoader onFinish={() => setIntroFinished(true)} />
      )}
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Skills />
        <Services />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
