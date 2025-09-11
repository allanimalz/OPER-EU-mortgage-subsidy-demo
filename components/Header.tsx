
import React from 'react';
import { BuildingIcon } from './icons/Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-primary shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <BuildingIcon className="h-8 w-8 text-brand-accent" />
            <h1 className="text-xl font-bold text-white ml-3">EU Mortgage Subsidy Copilot</h1>
          </div>
        </div>
      </div>
    </header>
  );
};
