'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
  onCopyToClipboard: () => void;
  onExportToPDF: () => void;
}

export function SummaryModal({ 
  isOpen, 
  onClose, 
  summary, 
  onCopyToClipboard, 
  onExportToPDF 
}: SummaryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-7xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">📄</span>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Brainstorming Session Summary
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-8 shadow-inner">
            <MarkdownRenderer content={summary} />
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              <span className="mr-2">📅</span>
              Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={onCopyToClipboard}
                className="bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border-slate-300 dark:border-slate-600"
              >
                <span className="mr-2">📋</span>
                Copy to Clipboard
              </Button>
              <Button 
                variant="outline" 
                onClick={onExportToPDF}
                className="bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border-slate-300 dark:border-slate-600"
              >
                <span className="mr-2">📥</span>
                Export HTML
              </Button>
              <Button 
                onClick={onClose}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 px-6"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}