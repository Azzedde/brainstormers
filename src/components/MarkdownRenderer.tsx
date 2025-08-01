'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const renderMarkdown = (text: string) => {
    // Split by lines to handle different elements
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];
    let listType: 'ul' | 'ol' | null = null;
    let codeBlock: string[] = [];
    let inCodeBlock = false;

    const flushList = () => {
      if (currentList.length > 0 && listType) {
        const ListComponent = listType === 'ul' ? 'ul' : 'ol';
        const listClass = listType === 'ul' 
          ? "list-disc list-inside ml-6 mb-4 space-y-2" 
          : "list-decimal list-inside ml-6 mb-4 space-y-2";
        elements.push(
          <ListComponent key={elements.length} className={listClass}>
            {currentList.map((item, idx) => (
              <li key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed pl-2">
                <span className="ml-1">{renderInlineMarkdown(item)}</span>
              </li>
            ))}
          </ListComponent>
        );
        currentList = [];
        listType = null;
      }
    };

    const flushCodeBlock = () => {
      if (codeBlock.length > 0) {
        elements.push(
          <pre key={elements.length} className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4">
            <code className="text-sm font-mono">{codeBlock.join('\n')}</code>
          </pre>
        );
        codeBlock = [];
      }
    };

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock();
          inCodeBlock = false;
        } else {
          flushList();
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlock.push(line);
        return;
      }

      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        flushList();
        elements.push(<br key={`br-${index}`} />);
        return;
      }

      // Headers - properly handle all levels
      if (trimmedLine.startsWith('#')) {
        flushList();
        
        // Count the number of # symbols
        const match = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2];
          
          switch(level) {
            case 1:
              elements.push(
                <h1 key={index} className="text-3xl font-bold mb-4 mt-6 text-slate-900 dark:text-slate-100">
                  {renderInlineMarkdown(text)}
                </h1>
              );
              break;
            case 2:
              elements.push(
                <h2 key={index} className="text-2xl font-bold mb-3 mt-5 text-slate-800 dark:text-slate-200">
                  {renderInlineMarkdown(text)}
                </h2>
              );
              break;
            case 3:
              elements.push(
                <h3 key={index} className="text-xl font-semibold mb-3 mt-4 text-slate-800 dark:text-slate-200">
                  {renderInlineMarkdown(text)}
                </h3>
              );
              break;
            case 4:
              elements.push(
                <h4 key={index} className="text-lg font-semibold mb-2 mt-4 text-slate-700 dark:text-slate-300">
                  {renderInlineMarkdown(text)}
                </h4>
              );
              break;
            case 5:
              elements.push(
                <h5 key={index} className="text-base font-semibold mb-2 mt-3 text-slate-700 dark:text-slate-300">
                  {renderInlineMarkdown(text)}
                </h5>
              );
              break;
            case 6:
              elements.push(
                <h6 key={index} className="text-sm font-semibold mb-2 mt-3 text-slate-600 dark:text-slate-400">
                  {renderInlineMarkdown(text)}
                </h6>
              );
              break;
          }
        }
      }
      // Horizontal rule
      else if (trimmedLine.match(/^(-{3,}|_{3,}|\*{3,})$/)) {
        flushList();
        elements.push(
          <hr key={index} className="my-6 border-t border-slate-300 dark:border-slate-700" />
        );
      }
      // Blockquote
      else if (trimmedLine.startsWith('>')) {
        flushList();
        elements.push(
          <blockquote key={index} className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 my-4 italic text-slate-700 dark:text-slate-300">
            {renderInlineMarkdown(trimmedLine.replace(/^>\s*/, ''))}
          </blockquote>
        );
      }
      // Bullet points
      else if (trimmedLine.match(/^[-*+]\s+/)) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        currentList.push(trimmedLine.replace(/^[-*+]\s+/, ''));
      }
      // Numbered lists
      else if (trimmedLine.match(/^\d+\.\s+/)) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        currentList.push(trimmedLine.replace(/^\d+\.\s+/, ''));
      }
      // Regular paragraphs
      else {
        flushList();
        elements.push(
          <p key={index} className="mb-3 text-slate-700 dark:text-slate-300 leading-relaxed">
            {renderInlineMarkdown(trimmedLine)}
          </p>
        );
      }
    });

    flushList(); // Flush any remaining list items
    flushCodeBlock(); // Flush any remaining code block
    return elements;
  };

  const renderInlineMarkdown = (text: string): React.ReactNode => {
    // Create a temporary container to build the result
    const parts: (string | React.ReactElement)[] = [];
    let lastIndex = 0;

    // Combined regex for all inline patterns
    const patterns = [
      { regex: /\*\*([^*]+)\*\*/g, replacement: (match: RegExpExecArray) => 
        <strong key={`bold-${match.index}`} className="font-bold text-slate-900 dark:text-slate-100">{match[1]}</strong> 
      },
      { regex: /(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, replacement: (match: RegExpExecArray) => 
        <em key={`italic-${match.index}`} className="italic text-slate-700 dark:text-slate-300">{match[1]}</em> 
      },
      { regex: /`([^`]+)`/g, replacement: (match: RegExpExecArray) => 
        <code key={`code-${match.index}`} className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-sm font-mono text-slate-800 dark:text-slate-200">{match[1]}</code> 
      },
      { regex: /\[([^\]]+)\]\(([^)]+)\)/g, replacement: (match: RegExpExecArray) => 
        <a key={`link-${match.index}`} href={match[2]} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">{match[1]}</a> 
      }
    ];

    // Process text with all patterns
    const processedText = text;
    const replacements: { start: number; end: number; element: React.ReactElement }[] = [];

    patterns.forEach(({ regex, replacement }) => {
      let match;
      while ((match = regex.exec(text)) !== null) {
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          element: replacement(match)
        });
      }
    });

    // Sort replacements by start position
    replacements.sort((a, b) => a.start - b.start);

    // Build the result
    replacements.forEach((rep) => {
      if (rep.start >= lastIndex) {
        // Add text before this replacement
        if (rep.start > lastIndex) {
          parts.push(text.substring(lastIndex, rep.start));
        }
        // Add the replacement
        parts.push(rep.element);
        lastIndex = rep.end;
      }
    });

    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? <>{parts}</> : text;
  };

  return (
    <div className={`${className}`}>
      {renderMarkdown(content)}
    </div>
  );
}