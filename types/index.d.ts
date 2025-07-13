export interface Category {
  value: string;
  label: string;
}
export interface ArticleType {
  id: string;
  title: string;
  description: string;
  content: string;
  category?: string;
  coverUrl?: string;
  tags?: string[];
  views?: number;
  status?: string;
  slug?: string;
  isActive?: boolean;
  createdAt?: any;
}
