// application.model.ts
export interface Application {
  id: number;
  reference_number: string;
  service_name: string;
  status: 'draft' | 'submitted' | 'returned' | 'completed';
  created_date: string;
  last_update?: string;
  case_data: any;
  applicant_type: number;
  case_type: number;
}

export interface ApplicationResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Application[];
}
