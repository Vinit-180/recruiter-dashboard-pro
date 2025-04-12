
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';
import { uploadResume } from '@/services/resumeService';
import { Resume } from '@/types/resume';
import { toast } from 'sonner';

interface ResumeUploadDialogProps {
  onUploadComplete: (resume: Resume) => void;
}

const ResumeUploadDialog: React.FC<ResumeUploadDialogProps> = ({ onUploadComplete }) => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    pdfUrl: '/sample-resume.pdf' // Using default PDF for demo
  });
  const [fileName, setFileName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      // In a real app, we would upload the file to a server here
      // For now, we're just using a mock PDF URL
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.position || !fileName) {
      toast.error('Please fill in all fields and upload a resume');
      return;
    }
    
    setUploading(true);
    
    try {
      const newResume = await uploadResume(formData);
      toast.success('Resume uploaded successfully');
      onUploadComplete(newResume);
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      position: '',
      pdfUrl: '/sample-resume.pdf'
    });
    setFileName('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload size={16} />
          Add Resume
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload New Resume</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Candidate Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="John Smith"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="john.smith@example.com"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="position">Position</Label>
            <Input 
              id="position" 
              name="position" 
              value={formData.position} 
              onChange={handleChange} 
              placeholder="Frontend Developer"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="resume">Resume (PDF)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="resume"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('resume')?.click()}
                className="w-full justify-start text-left font-normal"
              >
                {fileName || 'Select PDF file'}
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeUploadDialog;
