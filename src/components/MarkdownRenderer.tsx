import React from 'react';

interface Props {
  content: string;
}

export const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  // Simple custom formatter for standard markdown elements (headings, bold, lists, code blocks)
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    let inList = false;
    let listItems: React.ReactNode[] = [];

    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      // Check for headings
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-base font-bold text-emerald-950 dark:text-emerald-300 mt-4 mb-2 flex items-center gap-2">
            {formatBold(line.replace('### ', ''))}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-lg font-bold text-emerald-900 dark:text-emerald-400 border-b border-emerald-100 dark:border-emerald-800 pb-1 mt-5 mb-2">
            {formatBold(line.replace('## ', ''))}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-xl font-extrabold text-emerald-900 dark:text-emerald-400 mt-5 mb-3">
            {formatBold(line.replace('# ', ''))}
          </h1>
        );
      } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemContent = line.trim().substring(2);
        elements.push(
          <li key={index} className="ml-4 list-disc text-stone-700 dark:text-zinc-300 my-1 leading-relaxed">
            {formatBold(itemContent)}
          </li>
        );
      } else if (/^\d+\.\s/.test(line.trim())) {
        const itemContent = line.trim().replace(/^\d+\.\s/, '');
        elements.push(
          <li key={index} className="ml-4 list-decimal text-stone-700 dark:text-zinc-300 my-1 font-medium leading-relaxed">
            {formatBold(itemContent)}
          </li>
        );
      } else if (line.trim().startsWith('>')) {
        elements.push(
          <blockquote key={index} className="border-l-4 border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 p-3 rounded-r text-stone-700 dark:text-zinc-300 text-sm my-3 italic">
            {formatBold(line.trim().substring(1).trim())}
          </blockquote>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={index} className="h-2" />);
      } else {
        elements.push(
          <p key={index} className="text-stone-800 dark:text-zinc-200 my-1.5 leading-relaxed text-sm sm:text-base">
            {formatBold(line)}
          </p>
        );
      }
    });

    return elements;
  };

  const formatBold = (text: string) => {
    // Replace **bold**
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-stone-900 dark:text-zinc-100">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-stone-850 dark:text-zinc-350">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="bg-stone-100 dark:bg-zinc-800 text-emerald-850 dark:text-emerald-300 px-1.5 py-0.5 rounded text-xs font-mono border border-stone-200 dark:border-zinc-700">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return <div className="space-y-1">{renderFormattedText(content)}</div>;
};
