import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, renderHook, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

function createWrapper(queryClient?: QueryClient) {
  const client = queryClient ?? createTestQueryClient();
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={client}>
        <HelmetProvider>
          <MemoryRouter>{children}</MemoryRouter>
        </HelmetProvider>
      </QueryClientProvider>
    );
  };
}

function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { queryClient?: QueryClient },
) {
  const { queryClient, ...renderOptions } = options ?? {};
  return render(ui, { wrapper: createWrapper(queryClient), ...renderOptions });
}

function customRenderHook<Result, Props>(
  hook: (props: Props) => Result,
  options?: { queryClient?: QueryClient },
) {
  return renderHook(hook, {
    wrapper: createWrapper(options?.queryClient),
  });
}

export * from "@testing-library/react";
export { customRender as render, customRenderHook as renderHook, userEvent };
