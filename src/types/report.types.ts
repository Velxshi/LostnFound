export type Status = "Lost" | "Found" | "Done";

export interface CardItemProps {
  id: number;
  title: string;
  time: string;
  status: Status;
}
