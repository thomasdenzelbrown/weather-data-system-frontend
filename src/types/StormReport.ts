export interface StormReport {
  time: string;
  speed: number;
  location: string;
  severity: string;
  date: string;
  state: string;
  comments?: string;
}
