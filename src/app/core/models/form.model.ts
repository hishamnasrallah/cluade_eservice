// form.model.ts
export interface ServiceFlow {
  service_flow: ServiceFlowStep[];
}

export interface ServiceFlowStep {
  sequence_number: string;
  name: string;
  name_ara?: string;
  description?: string;
  description_ara?: string;
  is_hidden_page: boolean;
  page_id: number;
  categories: FieldCategory[];
}

export interface FieldCategory {
  id: number;
  name: string;
  name_ara?: string;
  repeatable: boolean;
  fields: FormField[];
}

export interface FormField {
  name: string;
  field_id: number;
  display_name: string;
  display_name_ara?: string;
  field_type: FieldType;
  mandatory: boolean;
  lookup?: number;
  allowed_lookups: LookupOption[];
  sub_fields: FormField[];
  is_hidden: boolean;
  is_disabled: boolean;
  visibility_conditions: any[];

  // Text field properties
  max_length?: number;
  min_length?: number;
  regex_pattern?: string;
  allowed_characters?: string;
  forbidden_words?: string;

  // Number field properties
  value_greater_than?: number;
  value_less_than?: number;
  integer_only?: boolean;
  positive_only?: boolean;
  precision?: number;

  // Boolean field properties
  default_boolean?: boolean;

  // Choice field properties
  max_selections?: number;
  min_selections?: number;

  // File field properties
  file_types?: string[];
  max_file_size?: number;
  image_max_width?: number;
  image_max_height?: number;
}

export type FieldType = 'text' | 'number' | 'decimal' | 'percentage' | 'boolean' | 'choice' | 'file';

export interface LookupOption {
  id: number;
  name: string;
  name_ara?: string;
  code: string;
  icon?: string;
}

export interface LookupResponse {
  count: number;
  next?: string;
  previous?: string;
  results: LookupOption[];
}
