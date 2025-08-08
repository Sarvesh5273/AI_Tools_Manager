export interface AITool {
  id: string;
  name: string;
  description: string;
  link: string;
  category: string;
  usageCount: number;
  tags: string[];
  addedDate: string;
  isUserFavorite?: boolean;
  imageUrl?: string;
}

export interface Category {
  name: string;
  count: number;
  color: string;
}