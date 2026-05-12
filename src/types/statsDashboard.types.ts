export type AdminStatsSummary = {
  total_reports: number;
  active_lost_items: number;
  active_found_items: number;
  returned_items: number;
};

export type ChartDataPoint = {
  date: string;
  label: string;
  lost: number;
  found: number;
  done: number;
};

export type AdminStatsResponse = {
  success: boolean;
  message: string;
  summary: AdminStatsSummary;
  chart_data: ChartDataPoint[];
};
