import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {remark} from 'remark';
import remarkGfm from 'remark-gfm';
import {visit} from 'unist-util-visit'
//import 'github-markdown-css';

const replaceTabs = () => (tree: any) => {
  
  visit(tree, 'text', (node: { value: string }) => {
    node.value = node.value.replace(/\t/g, '    ');
  });
};

interface MarkdownViewerProps {
  filePath: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ filePath }) => {
  const [markdown, setMarkdown] = useState<string>('');

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        
        const response = await fetch(filePath);
        const text = await response.text();

        
        const processedText = await remark()
          .use(remarkGfm)
          .use(replaceTabs) 
          .process(text);

        setMarkdown(processedText.toString());
      } catch (error) {
        console.error('Error processing markdown:', error);
        setMarkdown('## Error loading content');
      }
    };

    loadMarkdown();
  }, [filePath]);

  return (
    <div className="markdown-body">
      <ReactMarkdown
        components={{
            
          a: ({ node, ...props }) => (
            <a {...props} style={{ color: '#0366d6' }} />
          )
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;