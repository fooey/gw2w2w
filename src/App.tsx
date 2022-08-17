import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as JotaiProvider } from 'jotai';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Index } from './containers/index/Index';
import { Match } from './containers/match/Match';
import { defaultQueryFn } from './hooks/queries';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

export const App = () => {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route index element={<Index />} />
            <Route path=":matchId" element={<Match />} />
          </Routes>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </JotaiProvider>
  );
};
