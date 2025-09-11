
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-8 py-4 border-t">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        <p>
          This tool provides AI-generated information for advisory purposes only.
          Always verify details with official government sources.
        </p>
        <p>&copy; {new Date().getFullYear()} EU Mortgage Subsidy Copilot. All rights reserved.</p>
      </div>
    </footer>
  );
};
