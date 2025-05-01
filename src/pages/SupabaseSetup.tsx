import React, { useState, useEffect } from 'react';
import { checkSupabaseTables, getTableCreationSQL } from '../utils/supabaseSetup';
import { supabase } from '../lib/supabaseClient';
import { clearSchemaCache } from '../lib/authUtils';

const SupabaseSetup: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [sqlCopied, setSqlCopied] = useState(false);
  
  useEffect(() => {
    runDiagnostics();
  }, []);
  
  const runDiagnostics = async () => {
    try {
      setLoading(true);
      setMessage(null);
      const results = await checkSupabaseTables();
      setDiagnosticResults(results);
    } catch (error: any) {
      setMessage(`Error during diagnostics: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClearCache = async () => {
    try {
      setLoading(true);
      setMessage('Clearing schema cache...');
      await clearSchemaCache();
      setMessage('Schema cache cleared! Running diagnostics again...');
      await runDiagnostics();
    } catch (error: any) {
      setMessage(`Error clearing cache: ${error.message}`);
      setLoading(false);
    }
  };
  
  const handleCopySQL = () => {
    navigator.clipboard.writeText(getTableCreationSQL());
    setSqlCopied(true);
    setMessage('SQL copied to clipboard! Paste this in your Supabase SQL Editor to fix RLS issues.');
    setTimeout(() => {
      setSqlCopied(false);
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Supabase Setup &amp; Diagnostics</h1>
            <div className="space-x-4">
              <button
                onClick={runDiagnostics}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Running...' : 'Run Diagnostics'}
              </button>
              <button
                onClick={handleClearCache}
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                Clear Schema Cache
              </button>
            </div>
          </div>
          
          {message && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
              {message}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : diagnosticResults ? (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Diagnostic Results</h2>
                <div className={`p-4 rounded-md ${diagnosticResults.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  <p className="font-medium">
                    {diagnosticResults.success 
                      ? 'All tables and columns are properly set up!' 
                      : 'Issues were detected with your Supabase setup'}
                  </p>
                  {!diagnosticResults.success && (
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                      {diagnosticResults.issues.map((issue: string, index: number) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Table Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(diagnosticResults.tables).map(([tableName, tableInfo]: [string, any]) => (
                    <div 
                      key={tableName} 
                      className={`p-4 rounded-md cursor-pointer hover:bg-gray-50 ${selectedTable === tableName ? 'ring-2 ring-blue-500' : 'border border-gray-200'}`}
                      onClick={() => setSelectedTable(tableName)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{tableName}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tableInfo.exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {tableInfo.exists ? 'Exists' : 'Missing'}
                        </span>
                      </div>
                      {tableInfo.columns && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Columns:</p>
                          <div className="flex flex-wrap gap-1">
                            {tableInfo.columns.map((column: string) => (
                              <span 
                                key={column} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {column}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {tableInfo.error && (
                        <p className="mt-2 text-sm text-red-600">{tableInfo.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Common Error Solutions</h2>
                
                <div className="bg-white border border-gray-200 rounded-md shadow-sm mb-4">
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
                    <h3 className="font-medium">Row-Level Security (RLS) Policy Violations</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      If you see errors like <code className="bg-red-50 text-red-600 px-1 rounded">new row violates row-level security policy</code>, 
                      you need to correctly configure RLS policies in Supabase:
                    </p>
                    <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-2">
                      <li>
                        Go to your <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase dashboard</a>
                      </li>
                      <li>Select your project</li>
                      <li>Navigate to the "SQL Editor" section</li>
                      <li>Create a new query</li>
                      <li>Copy and paste the SQL code below</li>
                      <li>Run the query to set up proper RLS policies</li>
                    </ol>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-md shadow-sm">
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
                    <h3 className="font-medium">Schema Cache Errors</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      If you see errors like <code className="bg-red-50 text-red-600 px-1 rounded">Could not find the 'email' column of 'user_profiles'</code>, 
                      try these steps:
                    </p>
                    <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-2">
                      <li>Click the "Clear Schema Cache" button above</li>
                      <li>Refresh your browser</li>
                      <li>Try the operation again</li>
                      <li>If that doesn't work, make sure your tables have the correct columns by running the SQL below</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-2">SQL to Fix All Issues</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Run this SQL in the Supabase SQL Editor to create tables with proper RLS policies:
                </p>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
                    {getTableCreationSQL()}
                  </pre>
                  <button
                    onClick={handleCopySQL}
                    className={`absolute top-2 right-2 ${sqlCopied ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded text-xs transition-colors`}
                  >
                    {sqlCopied ? 'Copied!' : 'Copy SQL'}
                  </button>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">Instructions to Fix RLS Issues</h3>
                  <ol className="list-decimal pl-5 text-sm text-blue-700 space-y-2">
                    <li>Copy the SQL code above</li>
                    <li>Go to your <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="font-medium underline">Supabase dashboard</a></li>
                    <li>Open the SQL Editor (usually under "Table Editor" or directly in the left menu)</li>
                    <li>Create a new query</li>
                    <li>Paste the SQL code</li>
                    <li>Run the query</li>
                    <li>Return to the app and try signing in again</li>
                  </ol>
                </div>
              </div>
            </div>
          ) : (
            <p>No diagnostic results available. Click "Run Diagnostics" to check your Supabase setup.</p>
          )}
          
          <div className="mt-6">
            <a
              href="/assessment"
              className="inline-block px-4 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
            >
              Return to Assessment
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseSetup; 