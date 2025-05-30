// service.model.ts
export interface Service {
  id: number;
  parent_lookup: number;
  type: number;
  name: string;
  name_ara?: string;
  code: string;
  icon?: string;
  active_ind: boolean;
}

export interface ServiceResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Service[];
}
