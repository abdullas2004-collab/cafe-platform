/**
 * @startingPoint section="Components" subtitle="Primary, secondary, outline, ghost, destructive, link" viewport="700x200"
 */
export interface ButtonProps {
  /** Visual style */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  /** Renders as a square icon-only button */
  iconOnly?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}
