export type Status = "LOST" | "FOUND" | "DONE";

export interface ItemStatus {
  id: number;
  name: Status;
}

export interface ItemCategory {
  id: number;
  name: string;
}

export interface CardItemProps {
  id: number;
  title: string;
  image: string;
  status: ItemStatus;
  category: ItemCategory;
  time: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
}

export interface ItemsResponse {
  success: boolean;
  message: string;
  data: CardItemProps[];
  pagination: Pagination;
}

export interface StatistikLaporan {
  totalLaporan: number;
  totalHilang: number;
  totalTemuan: number;
  totalDikembalikan: number;
}
