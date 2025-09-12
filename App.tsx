import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AdvisorInputForm } from './components/AdvisorInputForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SummaryCard } from './components/SubsidyResults';
import { DetailsColumn } from './components/SubsidyVisualization';
import { findSubsidies } from './services/geminiService';
import { AdvisorInput, GeminiResponse, GroundingChunk } from './types';
import { WarningIcon, BuildingIcon, LinkIcon } from './components/icons/Icons';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeminiResponse | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isApiKeyAvailable, setIsApiKeyAvailable] = useState(true);

  useEffect(() => {
    // This check assumes `process.env` is available in the execution environment.
    // If API_KEY is not set, we show a configuration error to the user.
    if (!process.env.API_KEY) {
      console.error('CRITICAL: API_KEY environment variable is not set.');
      setIsApiKeyAvailable(false);
    }
  }, []);

  const handleSearch = async (input: AdvisorInput) => {
    setIsLoading(true);
    setResults(null);
    setSources([]);
    setError(null);
    try {
      const { response, sources } = await findSubsidies(input);
      setResults(response);
      setSources(sources);
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const InitialState = () => (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 h-full flex flex-col justify-center items-center text-center">
      <div className="bg-brand-light p-4 rounded-full mb-6">
          <BuildingIcon className="h-12 w-12 text-brand-primary" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">Subsidy Search Results</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        Enter your client's details and criteria on the left to find relevant mortgage subsidies. Results and official sources will appear here.
      </p>
    </div>
  );

  const ErrorMessage = ({ error }: { error: string }) => (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg" role="alert">
          <div className="flex">
              <div className="py-1">
                  <WarningIcon className="h-6 w-6 text-red-500 mr-4" />
              </div>
              <div>
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
              </div>
          </div>
      </div>
  );

  const SourcesList = ({ sources }: { sources: GroundingChunk[] }) => (
     <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <LinkIcon className="h-5 w-5 mr-2 text-gray-500" />
            Official Sources
        </h3>
        <ul className="space-y-3">
            {sources.map((source, index) => (
                <li key={index} className="text-sm flex items-start">
                    <span className="flex-shrink-0 text-center w-6 h-6 mr-3 mt-0.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-full flex items-center justify-center">{index + 1}</span>
                    <a
                        href={source.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-secondary hover:underline break-all group"
                    >
                        <span className="font-medium group-hover:text-brand-dark">{source.web.title || 'Untitled Source'}</span>
                        <span className="block text-gray-500 text-xs">{source.web.uri}</span>
                    </a>
                </li>
            ))}
        </ul>
    </div>
  );


  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-screen-2xl mx-auto">
          {isApiKeyAvailable ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Column 1: Input Form */}
                <div className="lg:col-span-3 xl:col-span-3">
                    <AdvisorInputForm onSubmit={handleSearch} isLoading={isLoading} />
                </div>

                {/* Conditional rendering for the right-hand side */}
                {isLoading || error || !results ? (
                    <div className="lg:col-span-9 xl:col-span-9">
                        {isLoading && <LoadingSpinner />}
                        {error && <ErrorMessage error={error} />}
                        {!isLoading && !error && !results && <InitialState />}
                    </div>
                ) : (
                    <>
                        {/* Column 2: AI Summary */}
                        <div className="lg:col-span-5 xl:col-span-5">
                            <SummaryCard results={results} sources={sources} />
                        </div>

                        {/* Column 3: Details */}
                        <div className="lg:col-span-4 xl:col-span-4 space-y-8">
                            {results.subsidies && results.subsidies.length > 0 && (
                                <DetailsColumn subsidies={results.subsidies} sources={sources} />
                            )}
                            {sources.length > 0 && <SourcesList sources={sources} />}
                        </div>
                    </>
                )}
            </div>
          ) : (
            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-800 p-6 mt-8 rounded-r-lg shadow-md" role="alert">
                <div className="flex">
                    <div className="flex-shrink-0 py-1">
                        <WarningIcon className="h-6 w-6 text-orange-500 mr-4" />
                    </div>
                    <div className="flex-grow">
                        <p className="font-bold text-lg mb-2">Application Not Configured</p>
                        <p className="mb-4">To use this application, you need to provide a Google Gemini API key. Please follow these steps:</p>
                        <ol className="list-decimal list-inside space-y-3 text-sm">
                            <li>
                                <strong>Get an API Key:</strong> Visit{' '}
                                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                                    Google AI Studio
                                </a> to create a new API key.
                            </li>
                            <li>
                                <strong>Set Environment Variable:</strong>
                                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                    <li>Create a file named <code>.env</code> in the root of your project directory.</li>
                                    <li>Add the following line to the <code>.env</code> file, replacing <code>YOUR_API_KEY</code> with the key you just created:</li>
                                </ul>
                                <pre className="bg-gray-800 text-white p-2 rounded-md mt-2 text-xs">
                                    <code>API_KEY=YOUR_API_KEY</code>
                                </pre>
                            </li>
                            <li>
                                <strong>Restart Your Application:</strong> Stop and restart your development server for the changes to take effect.
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;