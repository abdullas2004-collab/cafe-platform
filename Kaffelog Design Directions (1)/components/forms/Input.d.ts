export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  helperText?: string;
  /** e.g. "AED" */
  prefix?: string;
  /** e.g. "L" */
  suffix?: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  options?: { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
}

export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: () => void;
  indeterminate?: boolean;
}

export interface SwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: () => void;
  disabled?: boolean;
}
