import { Routes, Route } from 'react-router-dom';
import React from 'react';
import { RoutePath } from '../config/routes';
import { Level } from '../components/pages/levels/current_level';

interface AppNavigationProps {
  routes: Map<string, React.ElementType>;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({ routes }) => {
  return (
    <Routes>
      {Array.from(routes.entries()).map(([path, Component]) => (
        <Route 
          key={path} 
          path={path === RoutePath.default ? '/' : path} 
          element={<Component />} 
        />
      ))}
      
      <Route 
        path={RoutePath.level} 
        element={<Level />} 
      />
    </Routes>
  );
};