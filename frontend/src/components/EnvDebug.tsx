import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Globe } from 'lucide-react';

const EnvDebug: React.FC = () => {
  const envApiUrl = import.meta.env.VITE_API_URL;
  const mode = import.meta.env.MODE;
  const prod = import.meta.env.PROD;
  const dev = import.meta.env.DEV;

  // Simulate the same logic as the API service
  const getApiBaseUrl = (): string => {
    if (envApiUrl) {
      return envApiUrl.replace(/\/+$/, "");
    }

    if (import.meta.env.PROD) {
      return "https://khetsetu-backend.onrender.com/api";
    }

    return "http://localhost:5000/api";
  };

  const finalApiUrl = getApiBaseUrl();
  const testLoginUrl = `${finalApiUrl}/auth/login`;

  const testUrlConstruction = () => {
    const endpoint = '/auth/login';
    const rawUrl = `${envApiUrl}${endpoint}`;
    const fixedUrl = `${finalApiUrl}${endpoint}`;

    return {
      raw: rawUrl,
      fixed: fixedUrl,
      hasDoubleSlash: rawUrl.includes('//') && !rawUrl.startsWith('http')
    };
  };

  const urlTest = testUrlConstruction();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center space-x-2 mb-6">
        <Globe className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Environment Debug</h2>
      </div>

      <div className="space-y-6">
        {/* Environment Variables */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Environment Variables</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">MODE:</span>
              <span className="ml-2 text-gray-900">{mode}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">PROD:</span>
              <span className="ml-2 text-gray-900">{prod ? 'true' : 'false'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">DEV:</span>
              <span className="ml-2 text-gray-900">{dev ? 'true' : 'false'}</span>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-600">VITE_API_URL:</span>
              <span className="ml-2 text-gray-900 break-all">
                {envApiUrl || <em className="text-gray-500">Not set</em>}
              </span>
            </div>
          </div>
        </div>

        {/* API URL Analysis */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">API URL Analysis</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              {envApiUrl ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              )}
              <div>
                <p className="font-medium text-gray-800">Environment API URL</p>
                <p className="text-sm text-gray-600">
                  {envApiUrl ? (
                    <>Set to: <code className="bg-white px-2 py-1 rounded">{envApiUrl}</code></>
                  ) : (
                    'Not configured - using fallback'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Final API Base URL</p>
                <p className="text-sm text-gray-600">
                  Resolved to: <code className="bg-white px-2 py-1 rounded">{finalApiUrl}</code>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* URL Construction Test */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">URL Construction Test</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              {urlTest.hasDoubleSlash ? (
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              )}
              <div>
                <p className="font-medium text-gray-800">Raw URL Construction</p>
                <p className="text-sm text-gray-600">
                  {envApiUrl} + /auth/login = <code className="bg-white px-2 py-1 rounded">{urlTest.raw}</code>
                </p>
                {urlTest.hasDoubleSlash && (
                  <p className="text-xs text-red-600 mt-1">
                    ⚠️ Contains double slash - this causes the routing error!
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Fixed URL Construction</p>
                <p className="text-sm text-gray-600">
                  After fix: <code className="bg-white px-2 py-1 rounded">{urlTest.fixed}</code>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Endpoints */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Test Endpoints</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">Login:</span>
              <code className="ml-2 bg-white px-2 py-1 rounded text-gray-900">{testLoginUrl}</code>
            </div>
            <div>
              <span className="font-medium text-gray-600">Register:</span>
              <code className="ml-2 bg-white px-2 py-1 rounded text-gray-900">{finalApiUrl}/auth/register</code>
            </div>
            <div>
              <span className="font-medium text-gray-600">Health:</span>
              <code className="ml-2 bg-white px-2 py-1 rounded text-gray-900">{finalApiUrl}/health</code>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommendations</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start space-x-2">
              <span className="text-purple-600 font-bold">1.</span>
              <div>
                <p className="font-medium">For Production (Vercel):</p>
                <p>Set environment variable: <code className="bg-white px-2 py-1 rounded">VITE_API_URL=https://khetsetu-backend.onrender.com/api</code></p>
                <p className="text-xs text-gray-600 mt-1">Note: No trailing slash to prevent double slash issues</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-purple-600 font-bold">2.</span>
              <div>
                <p className="font-medium">For Development:</p>
                <p>Create <code className="bg-white px-2 py-1 rounded">.env</code> file with: <code className="bg-white px-2 py-1 rounded">VITE_API_URL=http://localhost:5000/api</code></p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-purple-600 font-bold">3.</span>
              <div>
                <p className="font-medium">Backend CORS:</p>
                <p>Ensure backend allows the frontend domain in CORS settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvDebug;
