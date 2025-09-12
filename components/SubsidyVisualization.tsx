import React, { useState } from 'react';
import { Subsidy, GroundingChunk } from '../types';
import { SparkleIcon, CheckCircleIcon, ChevronDownIcon } from './icons/Icons';
import { CitationLinker } from './SubsidyResults';

interface DetailsColumnProps {
  subsidies: Subsidy[];
  sources: GroundingChunk[];
}

const SubsidyCard: React.FC<{ subsidy: Subsidy; sources: GroundingChunk[] }> = ({ subsidy, sources }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-lg">
            <button
                className="w-full text-left p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 focus:outline-none"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
            >
                <h3 className="text-lg font-semibold text-brand-primary">{subsidy.name}</h3>
                <ChevronDownIcon className={`h-6 w-6 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            {isExpanded && (
                <div className="p-4 border-t border-gray-200">
                    <p className="text-gray-700 mb-4">
                        <CitationLinker text={subsidy.description} sources={sources} />
                    </p>
                    <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
                            Eligibility Criteria
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {subsidy.eligibility.map((item, index) => (
                                <li key={index}><CitationLinker text={item} sources={sources} /></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <SparkleIcon className="h-5 w-5 mr-2 text-yellow-500" />
                            Potential Benefit
                        </h4>
                        <p className="text-gray-600">
                            <CitationLinker text={subsidy.potentialBenefit} sources={sources} />
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export const DetailsColumn: React.FC<DetailsColumnProps> = ({ subsidies, sources }) => {
    if (!subsidies || subsidies.length === 0) {
        return null;
    }

    return (
        <div className="space-y-8">
            {/* Potential Benefits Visualization */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <SparkleIcon className="h-6 w-6 mr-2 text-brand-accent" />
                    Potential Benefits at a Glance
                </h3>
                <div className="space-y-3">
                    {subsidies.map((subsidy, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                            <p className="font-semibold text-gray-700">{subsidy.name}</p>
                            <p className="text-sm text-brand-primary font-medium">{subsidy.potentialBenefit}</p>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-4">
                    Note: Benefits are estimates and may vary based on your specific situation.
                </p>
            </div>

            {/* Discovered Subsidies List */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Discovered Subsidies</h3>
                <div className="space-y-4">
                {subsidies.map((subsidy, index) => (
                    <SubsidyCard key={index} subsidy={subsidy} sources={sources} />
                ))}
                </div>
            </div>
        </div>
    );
};