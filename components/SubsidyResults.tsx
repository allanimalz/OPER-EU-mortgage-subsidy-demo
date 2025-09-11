import React, { useState } from 'react';
import { GeminiResponse, GroundingChunk, Subsidy } from '../types';
import { CheckCircleIcon, LinkIcon, SparkleIcon, InfoIcon, WarningIcon, ChevronDownIcon } from './icons/Icons';
import { SubsidyVisualization } from './SubsidyVisualization';

interface SubsidyResultsProps {
  results: GeminiResponse;
  sources: GroundingChunk[];
}

// Helper component to parse text and convert bracketed citations like [1] into clickable links.
const CitationLinker: React.FC<{ text: string; sources: GroundingChunk[] }> = ({ text, sources }) => {
    if (!sources || sources.length === 0 || !text) {
        return <>{text}</>;
    }

    // Split the text by the citation pattern (e.g., "[1]", "[2]").
    // The regex includes capturing parentheses to keep the delimiter in the resulting array.
    const parts = text.split(/(\[\d+\])/g);

    return (
        <>
            {parts.map((part, index) => {
                const citationMatch = part.match(/\[(\d+)\]/);
                if (citationMatch) {
                    const citationNumber = parseInt(citationMatch[1], 10);
                    const sourceIndex = citationNumber - 1; // Citation [1] corresponds to sources[0].
                    if (sources[sourceIndex]) {
                        const source = sources[sourceIndex];
                        return (
                            <a
                                key={index}
                                href={source.web.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={source.web.title}
                                className="inline-block mx-0.5 px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-md text-xs font-semibold align-super hover:bg-blue-200 transition-colors"
                            >
                                {citationNumber}
                            </a>
                        );
                    }
                }
                // Return the text part if it's not a citation.
                return part;
            })}
        </>
    );
};

const SubsidyCard: React.FC<{ subsidy: Subsidy; sources: GroundingChunk[] }> = ({ subsidy, sources }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-lg">
            <button
                className="w-full text-left p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 focus:outline-none"
                onClick={() => setIsExpanded(!isExpanded)}
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

export const SubsidyResults: React.FC<SubsidyResultsProps> = ({ results, sources }) => {
    if (!results || !results.subsidies || results.subsidies.length === 0) {
        return (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <WarningIcon className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            {results?.summary ? (
                                <CitationLinker text={results.summary} sources={sources} />
                            ) : (
                                "No specific subsidies found based on the provided information. You may still be eligible for other programs."
                            )}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
  
    return (
      <div className="mt-8">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
            <div className="flex">
                <div className="flex-shrink-0">
                    <InfoIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">AI-Powered Summary</h3>
                    <div className="mt-2 text-sm text-blue-700">
                        <p><CitationLinker text={results.summary} sources={sources} /></p>
                    </div>
                </div>
            </div>
        </div>

        <SubsidyVisualization subsidies={results.subsidies} />

        <div className="space-y-4 mb-8">
          {results.subsidies.map((subsidy, index) => (
            <SubsidyCard key={index} subsidy={subsidy} sources={sources} />
          ))}
        </div>
        
        {sources && sources.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <LinkIcon className="h-5 w-5 mr-2 text-gray-500" />
              Sources
            </h3>
            <ul className="space-y-2">
              {sources.map((source, index) => (
                <li key={index} className="text-sm flex items-start">
                   <span className="flex-shrink-0 text-center w-5 h-5 mr-2 mt-0.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-full leading-5">{index + 1}</span>
                  <a
                    href={source.web.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-secondary hover:underline break-all"
                  >
                    {source.web.title || source.web.uri}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };