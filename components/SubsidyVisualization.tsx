import React from 'react';
import { Subsidy } from '../types';
import { SparkleIcon } from './icons/Icons';

interface SubsidyVisualizationProps {
  subsidies: Subsidy[];
}

export const SubsidyVisualization: React.FC<SubsidyVisualizationProps> = ({ subsidies }) => {
    if (!subsidies || subsidies.length === 0) {
        return null;
    }

    // A simple visualization comparing potential benefits
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <SparkleIcon className="h-6 w-6 mr-2 text-brand-accent" />
                Potential Benefits at a Glance
            </h3>
            <div className="space-y-3">
                {subsidies.map((subsidy, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                        <p className="font-semibold text-gray-700">{subsidy.name}</p>
                        <p className="text-sm text-brand-primary font-medium">{subsidy.potentialBenefit}</p>
                    </div>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
                Note: Benefits are estimates and may vary based on your specific situation.
            </p>
        </div>
    );
};
