export interface BannerProps {
  tone?: 'success' | 'warning' | 'error' | 'neutral';
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export interface ToastProps {
  tone?: 'success' | 'warning' | 'error' | 'neutral';
  message: string;
}
