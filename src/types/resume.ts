
export interface Resume {
  id: string;
  name: string;
  email: string;
  position: string;
  uploadDate: string;
  status: 'pending' | 'evaluating' | 'evaluated';
  atsScore?: number;
  pdfUrl: string;
}
