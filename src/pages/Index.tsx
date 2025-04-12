
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import ResumeListItem from '@/components/ResumeListItem';
import PDFViewer from '@/components/PDFViewer';
import ResumeUploadDialog from '@/components/ResumeUploadDialog';
import { Resume } from '@/types/resume';
import { evaluateResumes, getResumes } from '@/services/resumeService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Index = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeIds, setSelectedResumeIds] = useState<Set<string>>(new Set());
  const [activeResume, setActiveResume] = useState<Resume | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setIsLoading(true);
    try {
      const data = await getResumes();
      setResumes(data);
      if (data.length > 0 && !activeResume) {
        setActiveResume(data[0]);
      }
    } catch (error) {
      console.error('Failed to load resumes:', error);
      toast.error('Failed to load resumes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeSelect = (id: string, selected: boolean) => {
    const newSelectedIds = new Set(selectedResumeIds);
    if (selected) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    setSelectedResumeIds(newSelectedIds);
  };

  const handleResumeClick = (resume: Resume) => {
    setActiveResume(resume);
  };

  const handleUploadComplete = (newResume: Resume) => {
    setResumes(prevResumes => [newResume, ...prevResumes]);
    setActiveResume(newResume);
  };

  const handleEvaluate = async () => {
    if (selectedResumeIds.size === 0) {
      toast.error('Please select at least one resume to evaluate');
      return;
    }

    setIsEvaluating(true);
    try {
      const resumeIdsArray = Array.from(selectedResumeIds);
      const updatedResumes = await evaluateResumes(resumeIdsArray);
      setResumes(updatedResumes);
      setSelectedResumeIds(new Set());
    } catch (error) {
      console.error('Failed to evaluate resumes:', error);
      toast.error('Failed to submit resumes for evaluation');
    } finally {
      setIsEvaluating(false);
    }
  };

  const filteredResumes = resumes.filter(resume => {
    const query = searchQuery.toLowerCase();
    return (
      resume.name.toLowerCase().includes(query) ||
      resume.position.toLowerCase().includes(query) ||
      resume.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Recruiter Dashboard</h1>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex gap-1"
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <ResumeUploadDialog onUploadComplete={handleUploadComplete} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-8rem)]">
          {/* Left Panel: Resume List */}
          <div className="w-full md:w-2/5 bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden">
            <div className="p-3 border-b">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-medium">Resumes ({resumes.length})</h2>
                {selectedResumeIds.size > 0 && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="gap-1"
                    onClick={handleEvaluate}
                    disabled={isEvaluating}
                  >
                    {isEvaluating ? (
                      <>
                        <span className="animate-pulse">Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Evaluate ({selectedResumeIds.size})
                      </>
                    )}
                  </Button>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search resumes..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Loading resumes...</div>
              ) : filteredResumes.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchQuery ? 'No matches found' : 'No resumes available'}
                </div>
              ) : (
                filteredResumes.map((resume) => (
                  <ResumeListItem
                    key={resume.id}
                    resume={resume}
                    isSelected={selectedResumeIds.has(resume.id)}
                    onSelect={handleResumeSelect}
                    onClick={handleResumeClick}
                    isActive={activeResume?.id === resume.id}
                  />
                ))
              )}
            </div>
          </div>
          
          {/* Right Panel: PDF Viewer */}
          <div className="w-full md:w-3/5 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
            <PDFViewer resume={activeResume} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
