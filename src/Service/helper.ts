import { mapRequest } from "./mapRequest";
import { Response, urlGenerator } from "./types";

export function* urlListGenerator(
  urls: Array<string>
): Generator<urlGenerator> {
  for (let index = 0; index < urls.length; index++) {
    const currentValue = urls[index];
    yield [currentValue, index];
  }
}

export const worker = async (
  gen: Generator<urlGenerator>,
  result: Response[]
) => {
  for (let [currentValue, index] of gen) {
    const url = normalizeUrl(currentValue);
    if (url) {
      result[index] = await mapRequest(url);
    }
  }
};

const normalizeUrl = (url: string) => {
  try {
    if (!url.startsWith("https://") && !url.startsWith("http://")) {
      url = `http://${url}`;
    }
    return new URL(url).toString();
  } catch (e) {
    console.error("Invalid url provided", e);
  }
};
