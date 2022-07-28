export type urlGenerator = [string, number];

export interface Success {
  status: "fulfilled";
  value: string;
}

export interface Failure {
  status: "rejected";
  reason: any;
}

export type Response = Success | Failure;
