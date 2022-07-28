import * as Request from "../Service/mapRequest";
import { runInParallel } from "../Service/FetchParallel";
import * as Service from "../Service/helper";

const urls = new Array(50)
  .fill(1)
  .map((v, i) => `https://jsonplaceholder.typicode.com/todos/${i + 1}`);

test("expect empty list", async () => {
  const response = await runInParallel();
  expect(response.length).toBeLessThan(1);
});

test("test success and failure mix", async () => {
  const mapRequestMock = jest
    .spyOn(Request, "mapRequest")
    .mockImplementation(() =>
      Promise.resolve({
        status: "rejected",
        reason: new Error("rejected"),
      })
    );

  mapRequestMock
    .mockResolvedValueOnce({
      status: "fulfilled",
      value: "userId",
    })
    .mockResolvedValueOnce({
      status: "fulfilled",
      value: "nethermind",
    })
    .mockResolvedValueOnce({
      status: "rejected",
      reason: new Error("rejected"),
    });

  const response = await runInParallel(urls, 5);
  expect(response[0]).toContain("userId");
  expect(response[1]).toContain("nethermind");
  expect(response.length).toEqual(2);
});

test("Test url list generator", () => {
  const iterable = Service.urlListGenerator(urls);
  expect(iterable.next().value).toEqual([urls[0], 0]);
  expect(iterable.next().value).toEqual([urls[1], 1]);
  expect(iterable.next().value).toEqual([urls[2], 2]);
});

test("test parallel calls", async () => {
  const mapRequestMock = jest
    .spyOn(Request, "mapRequest")
    .mockImplementation(() =>
      Promise.resolve({
        status: "fulfilled",
        value: "userId",
      })
    );

  const response = await runInParallel(urls.slice(0, 20), 5);
  expect(response[0]).toContain("userId");
  expect(response.length).toEqual(20);

  mapRequestMock.mockClear();
});

test("expect helpers to be called", async () => {
  const mapRequestMock = jest
    .spyOn(Request, "mapRequest")
    .mockImplementation(() =>
      Promise.resolve({
        status: "fulfilled",
        value: "success",
      })
    );

  const worker = jest.spyOn(Service, "worker");
  const urlListGenerator = jest.spyOn(Service, "urlListGenerator");

  const response = await runInParallel(urls, 5);

  expect(response.length).toEqual(50);
  expect(mapRequestMock).toHaveBeenCalledTimes(50);
  expect(worker).toHaveBeenCalledTimes(5);
  expect(urlListGenerator).toHaveBeenCalledTimes(1);

  mapRequestMock.mockRestore();
});
