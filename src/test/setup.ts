import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { server } from "test/mocks/server";

// Mock the storage utility — jsdom/Node localStorage conflicts cause errors
vi.mock("utils/storage", () => ({
  default: {
    getToken: () => null,
    setToken: () => {},
    clearToken: () => {},
  },
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
