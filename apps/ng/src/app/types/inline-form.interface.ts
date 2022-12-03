export type InlineFormField = {
  name: string;
  required: boolean;
  defaultValue?: string;
  placeholder?: string;
  type: 'text' | 'email' | 'password' | 'textarea';
  minLength?: number;
};

export type InlineFormFields = InlineFormField[];
