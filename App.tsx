import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AdvisorInputForm } from './components/AdvisorInputForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SubsidyResults } from './components/SubsidyResults';
import { findSubsidies } from './services/geminiService';
import { AdvisorInput, GeminiResponse, GroundingChunk } from './types';
import { WarningIcon } from './components/icons/Icons';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeminiResponse | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <AdvisorInputForm onSubmit={handleSearch} isLoading={isLoading} />
          {isLoading && <LoadingSpinner />}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-8 rounded-r-lg" role="alert">
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
          )}
          {results && <SubsidyResults results={results} sources={sources} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
