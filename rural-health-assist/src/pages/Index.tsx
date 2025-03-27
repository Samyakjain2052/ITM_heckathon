
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Index: React.FC = () => {
  const { setLanguage } = useLanguage();
  
  // Reset language to Hindi when landing on the index page
  useEffect(() => {
    setLanguage('hindi');
  }, [setLanguage]);

  // Redirect to language selection page
  return <Navigate to="/language-selection" replace />;
};

export default Index;
