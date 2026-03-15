'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type RewriteStyle = 'formal' | 'casual' | 'concise' | 'expanded';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<RewriteStyle>('formal');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const styles: { value: RewriteStyle; label: string; description: string }[] = [
    { value: 'formal', label: 'Formal', description: 'Professional and polished' },
    { value: 'casual', label: 'Casual', description: 'Friendly and conversational' },
    { value: 'concise', label: 'Concise', description: 'Brief and to the point' },
    { value: 'expanded', label: 'Expanded', description: 'Detailed and comprehensive' },
  ];

  const handleRewrite = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setOutputText('');

    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          style: selectedStyle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to rewrite text');
      }

      const data = await response.json();
      setOutputText(data.rewrittenText);
    } catch (error) {
      console.error('Error:', error);
      setOutputText('Error: Failed to rewrite text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;

    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              AI Text Rewriter
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Transform your text with different writing styles powered by AI
            </p>
          </div>

          {/* Style Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
              Select Writing Style
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {styles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => setSelectedStyle(style.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStyle === style.value
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {style.label}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {style.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Text Areas */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Original Text
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
              />
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {inputText.length} characters
              </div>
            </div>

            {/* Output */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Rewritten Text
                </label>
                {outputText && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
              <textarea
                value={outputText}
                readOnly
                placeholder="Rewritten text will appear here..."
                className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
              />
              {outputText && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {outputText.length} characters
                </div>
              )}
            </div>
          </div>

          {/* Rewrite Button */}
          <div className="flex justify-center">
            <button
              onClick={handleRewrite}
              disabled={!inputText.trim() || isLoading}
              className={`px-8 py-4 text-lg font-semibold rounded-lg transition-all ${
                !inputText.trim() || isLoading
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Rewriting...
                </span>
              ) : (
                'Rewrite Text'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
