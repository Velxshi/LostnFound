export interface CategoryItemProps {
  id: number;
  name: string;
  linkImage: string;
  totalItems: number;
}

export interface ItemsResponse {
  success: boolean;
  message: string;
  totalItems: number;
  totalCategories: number;
  categories: CategoryItemProps[];
}
