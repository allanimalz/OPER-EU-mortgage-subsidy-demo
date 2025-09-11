import React, { useState } from 'react';
import { EU_COUNTRIES } from '../constants';
import { AdvisorInput, SearchFilters } from '../types';
import { SearchIcon, SparkleIcon, ChevronDownIcon } from './icons/Icons';
import { generateRandomProfile } from '../services/geminiService';

interface AdvisorInputFormProps {
  onSubmit: (input: AdvisorInput) => void;
  isLoading: boolean;
}

const eligibilityOptions = ['First-time Buyer', 'Energy Efficiency', 'Renovation', 'Low Income', 'Young Applicant (under 35)', 'Family with Children'];
const subsidyTypeOptions = ['Grant', 'Loan', 'Tax Credit'];

export const AdvisorInputForm: React.FC<AdvisorInputFormProps> = ({ onSubmit, isLoading }) => {
  const [country, setCountry] = useState<string>(EU_COUNTRIES[0]);
  const [clientProfile, setClientProfile] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    minGrantAmount: '',
    eligibility: [],
    customEligibility: '',
    subsidyTypes: [],
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, filterType: 'eligibility' | 'subsidyTypes') => {
    const { value, checked } = e.target;
    setFilters(prev => {
        const currentValues = prev[filterType];
        if (checked) {
            return { ...prev, [filterType]: [...currentValues, value] };
        } else {
            return { ...prev, [filterType]: currentValues.filter(item => item !== value) };
        }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      country,
      clientProfile,
      filters,
    });
  };
  
  const handleGenerateProfile = async () => {
    setIsGenerating(true);
    try {
        const profile = await generateRandomProfile(country);
        setClientProfile(profile);
    } catch (error) {
        console.error("Error generating profile:", error);
    } finally {
        setIsGenerating(false);
    }
  };

  const isFormDisabled = isLoading || isGenerating;

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Your Mortgage Subsidy</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            disabled={isFormDisabled}
          >
            {EU_COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        
        <div>
            <div className="flex justify-between items-center mb-1">
                 <label htmlFor="clientProfile" className="block text-sm font-medium text-gray-700">
                    Client Profile
                </label>
                <button
                    type="button"
                    onClick={handleGenerateProfile}
                    disabled={isFormDisabled}
                    className="flex items-center text-sm font-medium text-brand-secondary hover:text-brand-dark disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    <SparkleIcon className="h-4 w-4 mr-1" />
                    {isGenerating ? 'Generating...' : 'Generate Example'}
                </button>
            </div>
          <textarea
            id="clientProfile"
            rows={4}
            value={clientProfile}
            onChange={(e) => setClientProfile(e.target.value)}
            placeholder="e.g., First-time home buyer, under 35 years old, looking to purchase a new energy-efficient apartment."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            disabled={isFormDisabled}
            required
          />
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex justify-between items-center text-left font-medium text-gray-700 p-2 rounded-md hover:bg-gray-50 focus:outline-none"
            aria-expanded={showFilters}
          >
            <span>Advanced Filters</span>
            <ChevronDownIcon className={`h-5 w-5 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          {showFilters && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
              <div>
                <label htmlFor="minGrantAmount" className="block text-sm font-medium text-gray-700 mb-1">Minimum Grant Amount (€)</label>
                <input
                  type="number"
                  id="minGrantAmount"
                  name="minGrantAmount"
                  value={filters.minGrantAmount}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                  placeholder="e.g., 5000"
                  disabled={isFormDisabled}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specific Eligibility</label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {eligibilityOptions.map(option => (
                    <label key={option} className="flex items-center text-sm text-gray-600">
                      <input type="checkbox" value={option} onChange={(e) => handleCheckboxChange(e, 'eligibility')} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-secondary" disabled={isFormDisabled}/>
                      <span className="ml-2">{option}</span>
                    </label>
                  ))}
                </div>
                 <input
                  type="text"
                  name="customEligibility"
                  value={filters.customEligibility}
                  onChange={handleFilterChange}
                  className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                  placeholder="Other criteria..."
                  disabled={isFormDisabled}
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subsidy Type</label>
                <div className="flex space-x-4">
                  {subsidyTypeOptions.map(option => (
                    <label key={option} className="flex items-center text-sm text-gray-600">
                      <input type="checkbox" value={option} onChange={(e) => handleCheckboxChange(e, 'subsidyTypes')} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-secondary" disabled={isFormDisabled}/>
                      <span className="ml-2">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>


        <button
          type="submit"
          disabled={isFormDisabled || !clientProfile}
          className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              <SearchIcon className="h-5 w-5 mr-2" />
              Search for Subsidies
            </>
          )}
        </button>
      </form>
    </div>
  );
};
