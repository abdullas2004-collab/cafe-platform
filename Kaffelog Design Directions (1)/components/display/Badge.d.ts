/**
 * @startingPoint section="Components" subtitle="Status pill — SAFE / DUE SOON / NEEDS ATTENTION" viewport="700x120"
 */
export interface BadgeProps {
  tone?: 'success' | 'warning' | 'error' | 'neutral';
  children?: React.ReactNode;
}

export interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  inverse?: boolean;
}

export interface MetricTileProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  tone?: 'success' | 'error' | 'neutral';
}

export interface StatusRowProps {
  label: string;
  meta: string;
  status?: 'success' | 'warning' | 'error';
}
