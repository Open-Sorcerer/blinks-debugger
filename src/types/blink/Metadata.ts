export interface ChessApiResponse {
  icon: string;
  title: string;
  label: string;
  description: string;
  links: {
    actions: ChessAction[];
  };
}

interface ChessAction {
  href: string;
  label: string;
  parameters?: ChessActionParameter[];
}

interface ChessActionParameter {
  name: string;
  label: string;
}

export interface BlinkTransaction {
  tx: string;
  message?: string;
}
