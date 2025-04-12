
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Resume } from '@/types/resume';

interface PDFViewerProps {
  resume: Resume | null;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ resume }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Reset iframe when resume changes
    if (iframeRef.current) {
      iframeRef.current.src = 'about:blank';
      setTimeout(() => {
        if (iframeRef.current && resume) {
          iframeRef.current.src = resume.pdfUrl;
        }
      }, 100);
    }
  }, [resume]);

  if (!resume) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">Select a resume to view</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-4 py-2 bg-white border-b">
        <h3 className="font-medium">{resume.name} - {resume.position}</h3>
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
      <div className="flex-1 bg-gray-100 h-full">
        <iframe 
          ref={iframeRef}
          title="Resume PDF Viewer"
          className="w-full h-full"
          src={resume.pdfUrl}
        />
      </div>
    </div>
  );
};

export default PDFViewer;
