
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { FileText, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockEmailContent } from '@/services/resumeService';

interface ResumeListItemProps {
  resume: Resume;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onClick: (resume: Resume) => void;
  isActive: boolean;
}

const ResumeListItem: React.FC<ResumeListItemProps> = ({ 
  resume, 
  isSelected, 
  onSelect, 
  onClick,
  isActive 
}) => {
  const handleCheckboxChange = (checked: boolean) => {
    onSelect(resume.id, checked);
  };

  const handleClick = () => {
    onClick(resume);
  };

  const getStatusColor = (status: Resume['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-700';
      case 'evaluating': return 'bg-yellow-100 text-yellow-700';
      case 'evaluated': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: Resume['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'evaluating': return 'Evaluating...';
      case 'evaluated': return 'Evaluated';
      default: return 'Unknown';
    }
  };

  return (
    <div 
      className={cn(
        "flex items-start p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors",
        isActive && "bg-recruiter-lightBlue"
      )}
      onClick={handleClick}
    >
      <div className="pr-3 pt-1">
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()} 
          className="mt-1"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-sm truncate">{resume.name}</h3>
            <p className="text-xs text-gray-500 truncate">{resume.position}</p>
          </div>
          <div className={cn("text-xs px-2 py-1 rounded-full", getStatusColor(resume.status))}>
            {getStatusText(resume.status)}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center text-xs text-gray-500">
            <FileText className="h-3 w-3 mr-1" />
            <span>{resume.uploadDate}</span>
          </div>
          
          {resume.status === 'evaluated' && (
            <div className="flex items-center gap-2">
              <div className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                ATS: {resume.atsScore}/100
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Mail className="h-3.5 w-3.5 text-gray-500" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Email Sent to {resume.name}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 border rounded-md p-4 max-h-[70vh] overflow-auto">
                    <div dangerouslySetInnerHTML={{ __html: mockEmailContent(resume) }} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeListItem;
