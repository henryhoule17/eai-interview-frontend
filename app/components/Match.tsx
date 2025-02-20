import { useState, useEffect, useCallback } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import type { ExtractedData } from '../upload/page';

interface MatchResult {
  match: string;
  score: number;
}

interface MatchResponse {
  results: {
    [key: string]: MatchResult[];
  };
}

export interface MatchProps {
  extractedData: ExtractedData | null;
  setExtractedData: (data: ExtractedData | null) => void;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export default function Match({ extractedData, setExtractedData }: MatchProps) {
  const [matchResults, setMatchResults] = useState<MatchResponse | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatches, setSelectedMatches] = useState<{ [key: string]: string }>({});
//   const [isFinalized, setIsFinalized] = useState(false);

  const matchData = useCallback(async () => {
    if (!extractedData?.items?.length) return;

    try {
      setIsMatching(true);
      setError(null);

      // Get all item names from the extracted data
      const queries = extractedData.items.map(item => item.name);

      // Send to the match endpoint
      const response = await fetch(`${BACKEND_URL}/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queries),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as MatchResponse;
      setMatchResults(data);
      
      // Auto-select top matches
      const initialSelections = Object.entries(data.results).reduce((acc, [query, matches]) => {
        if (matches.length > 0) {
          acc[query] = matches[0].match;
        }
        return acc;
      }, {} as { [key: string]: string });
      setSelectedMatches(initialSelections);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error matching data:', err);
    } finally {
      setIsMatching(false);
    }
  }, [extractedData]);

  // Match data when extracted data changes
  useEffect(() => {
    if (extractedData?.items?.length) {
      matchData();
    }
  }, [extractedData, matchData]);

  if (!extractedData?.items?.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        No items found in the extracted data.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isMatching ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : error ? (
        <div className="p-4 text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      ) : matchResults ? (
        <div className="space-y-6">
          <div className="flex justify-center">
            <button
              onClick={() => {
                if (extractedData?.items && Object.keys(selectedMatches).length > 0) {
                  const newItems = extractedData.items.map(item => {
                    const selectedMatch = selectedMatches[item.name];
                    if (selectedMatch) {
                      return { ...item, name: selectedMatch };
                    }
                    return item;
                  });
                  setExtractedData({ ...extractedData, items: newItems });
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={Object.keys(selectedMatches).length === 0}
            >
              Submit Match Selections
            </button>
          </div>
          {Object.entries(matchResults.results).map(([query, matches]) => (
            <div key={query} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <h3 className="font-medium text-gray-700">Current: {query}</h3>
              </div>
              <div className="divide-y">
                {matches.map((match, index) => {
                  const isSelected = selectedMatches[query] === match.match;
                  return (
                    <button
                      key={index}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-100 focus:outline-none ${isSelected ? 'bg-blue-50' : ''}`}
                      onClick={() => {
                        // Update selected matches
                        const newSelectedMatches = { ...selectedMatches, [query]: match.match };
                        setSelectedMatches(newSelectedMatches);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                          )}
                          <div className="text-sm">{match.match}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {Math.round(match.score)}% match
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
