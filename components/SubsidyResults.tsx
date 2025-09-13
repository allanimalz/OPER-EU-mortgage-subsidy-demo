import React from 'react';
import { GeminiResponse, GroundingChunk } from '../types';
import { SparkleIcon, WarningIcon } from './icons/Icons';

interface SummaryCardProps {
  results: GeminiResponse;
  sources: GroundingChunk[];
}

/**
 * A helper component that parses text and converts bracketed citations (e.g., "[1]")
 * into clickable links that point to the corresponding source.
 * @param {object} props - The component props.
 * @param {string} props.text - The text to parse for citations.
 * @param {GroundingChunk[]} props.sources - The list of sources to link to.
 */
export const CitationLinker: React.FC<{ text: string; sources: GroundingChunk[] }> = ({ text, sources }) => {
    // Return plain text if there are no sources or text to process.
    if (!sources || sources.length === 0 || !text) {
        return <>{text}</>;
    }

    // Split the text by the citation pattern (e.g., "[1]", "[2]").
    // The regex uses a capturing group `()` to keep the delimiter (the citation itself) in the resulting array.
    const parts = text.split(/(\[\d+\])/g);

    return (
        <>
            {parts.map((part, index) => {
                const citationMatch = part.match(/\[(\d+)\]/);
                // If the part is a citation...
                if (citationMatch) {
                    const citationNumber = parseInt(citationMatch[1], 10);
                    const sourceIndex = citationNumber - 1; // Citation [1] corresponds to sources[0].
                    
                    // ...and a corresponding source exists...
                    if (sources[sourceIndex]) {
                        const source = sources[sourceIndex];
                        // ...render it as a link.
                        return (
                            <a
                                key={index}
                                href={source.web.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={source.web.title}
                                className="inline-block text-center mx-1 px-2 py-0.5 bg-brand-light text-brand-primary rounded-full text-xs font-bold align-super hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-1"
                                aria-label={`Source ${citationNumber}: ${source.web.title}`}
                            >
                                {citationNumber}
                            </a>
                        );
                    }
                }
                // Return the text part as-is if it's not a valid citation.
                return part;
            })}
        </>
    );
};

/**
 * A card component that displays the AI-generated summary of the subsidy search.
 * It also handles the case where no subsidies are found.
 */
export const SummaryCard: React.FC<SummaryCardProps> = ({ results, sources }) => {
    // Render a "not found" message if the results are empty or invalid.
    if (!results || !results.subsidies || results.subsidies.length === 0) {
        return (
            <div className="bg-gradient-to-br from-yellow-50 to-white p-6 md:p-8 rounded-lg shadow-lg border border-yellow-200 h-full">
                <div className="flex items-start">
                    <div className="flex-shrink-0 bg-yellow-500 text-white rounded-full p-3">
                        <WarningIcon className="h-7 w-7" />
                    </div>
                    <div className="ml-4 flex-1">
                         <h3 className="text-xl font-bold text-yellow-900 mb-1">No Subsidies Found</h3>
                         <p className="text-sm text-gray-500 mb-4">Based on your criteria.</p>
                        <div className="space-y-4 text-base text-gray-700 leading-relaxed border-t border-yellow-200 pt-4">
                             <p>
                                {results?.summary ? (
                                    <CitationLinker text={results.summary} sources={sources} />
                                ) : (
                                    "No specific subsidies were found based on the provided profile and filters. Try adjusting your criteria or broadening the search."
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
  
    // Render the main summary card if results are found.
    return (
        <div className="bg-gradient-to-br from-brand-light to-white p-6 md:p-8 rounded-lg shadow-lg border border-blue-100 h-full">
            <div className="flex items-start">
                <div className="flex-shrink-0 bg-brand-primary text-white rounded-full p-3">
                    <SparkleIcon className="h-7 w-7" />
                </div>
                <div className="ml-4 flex-1">
                    <h3 className="text-xl font-bold text-brand-dark mb-1">AI-Powered Summary</h3>
                    <p className="text-sm text-gray-500 mb-4">A high-level overview of the findings based on your criteria.</p>
                    <div className="space-y-4 text-base text-gray-700 leading-relaxed border-t border-blue-200 pt-4">
                        {results.summary.split('\n').map((paragraph, index) => (
                            // Render each paragraph of the summary, filtering out empty lines.
                            paragraph.trim() ? (
                                <p key={index}>
                                    <CitationLinker text={paragraph} sources={sources} />
                                </p>
                            ) : null
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};