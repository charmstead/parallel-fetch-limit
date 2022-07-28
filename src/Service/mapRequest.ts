import { Response } from "./types";

export async function mapRequest(currentUrl: string): Promise<Response> {
  try {
    return {
      status: "fulfilled",
      value: await fetch(currentUrl).then((res) => res.text()),
    };
  } catch (reason) {
    return {
      status: "rejected",
      reason,
    };
  }
}
