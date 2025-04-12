import { Resume } from '@/types/resume';
import { toast } from 'sonner';

// Mock data
const mockResumes: Resume[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    position: "Frontend Developer",
    uploadDate: "2025-04-10",
    status: "pending",
    pdfUrl: "/sample-resume.pdf"
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    position: "UX Designer",
    uploadDate: "2025-04-08",
    status: "evaluated",
    atsScore: 87,
    pdfUrl: "/sample-resume.pdf"
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    position: "Product Manager",
    uploadDate: "2025-04-05",
    status: "pending",
    pdfUrl: "/sample-resume.pdf"
  },
  {
    id: "4",
    name: "Sarah Davis",
    email: "sarah.davis@example.com",
    position: "Marketing Specialist",
    uploadDate: "2025-04-01",
    status: "evaluated",
    atsScore: 92,
    pdfUrl: "/sample-resume.pdf"
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@example.com",
    position: "Backend Developer",
    uploadDate: "2025-03-28",
    status: "evaluating",
    pdfUrl: "/sample-resume.pdf"
  }
];

// Mock email content
export const mockEmailContent = (resume: Resume) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <h2 style="color: #0056B3;">Resume Evaluation Results</h2>
      <p>Dear ${resume.name},</p>
      <p>Thank you for submitting your resume for the ${resume.position} position at our company.</p>
      ${resume.atsScore ? `
        <p>We've evaluated your resume using our Applicant Tracking System (ATS), and we're pleased to inform you that your resume received a score of <strong>${resume.atsScore}/100</strong>.</p>
        ${resume.atsScore >= 85 ? 
          `<p>Congratulations! Your resume has passed our initial screening process. Our hiring team will be in touch with you shortly to discuss the next steps in the application process.</p>` : 
          `<p>While we appreciate your interest, we are looking for candidates with a higher match to our requirements. We encourage you to review our job description and consider applying for other positions that might better match your skills and experience.</p>`
        }
      ` : `
        <p>Your resume is currently being evaluated, and we will notify you once the evaluation process is complete.</p>
      `}
      <p>Best regards,</p>
      <p>HR Team<br>Recruiter Dashboard Pro</p>
    </div>
  `;
};

// Get all resumes
export const getResumes = (): Promise<Resume[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockResumes]);
    }, 500);
  });
};

// Upload a new resume
export const uploadResume = (resume: Omit<Resume, 'id' | 'uploadDate' | 'status'>): Promise<Resume> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newResume: Resume = {
        ...resume,
        id: `${mockResumes.length + 1}`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      
      mockResumes.unshift(newResume);
      resolve(newResume);
    }, 800);
  });
};

// Evaluate resumes
export const evaluateResumes = (resumeIds: string[]): Promise<Resume[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedResumes = mockResumes.map(resume => {
        if (resumeIds.includes(resume.id)) {
          return {
            ...resume,
            status: 'evaluating' as const
          };
        }
        return resume;
      });
      
      toast.success(`${resumeIds.length} resumes submitted for evaluation`);
      resolve(updatedResumes);
      
      // Simulate the backend evaluation process
      setTimeout(() => {
        resumeIds.forEach(id => {
          const resumeIndex = mockResumes.findIndex(r => r.id === id);
          if (resumeIndex !== -1) {
            mockResumes[resumeIndex] = {
              ...mockResumes[resumeIndex],
              status: 'evaluated',
              atsScore: Math.floor(Math.random() * 31) + 70 // Random score between 70-100
            };
          }
        });
        
        toast.success("Resume evaluation completed!");
      }, 5000); // Simulate 5 seconds processing time
    }, 1000);
  });
};
