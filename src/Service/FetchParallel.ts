import { urlListGenerator, worker } from "./helper";
import { Response, Success } from "./types";

export async function runInParallel(
  urls: string[] = [],
  concurrency: number = 10
): Promise<string[]> {
  const result: Response[] = [];

  if (urls?.length === 0) {
    return urls;
  }

  const gen = urlListGenerator(urls);

  concurrency = Math.min(concurrency, urls.length);

  const workers = new Array(concurrency);

  for (let i = 0; i < concurrency; i++) {
    workers.push(worker(gen, result));
  }

  console.log(`Initialized ${concurrency} workers`);

  await Promise.all(workers);

  return (
    result.filter(({ status }) => status === "fulfilled") as Success[]
  ).map(({ value }) => value);
}
