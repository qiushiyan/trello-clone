export type InlineFormField = {
  name: string;
  defaultValue: string;
  required: boolean;
  type: 'text' | 'email' | 'password' | 'textarea';
  minLength?: number;
};

export type InlineFormFields = InlineFormField[];
