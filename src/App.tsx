import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Loading } from './components/Loading';
// import { MatchOverviewsContainer } from '~/containers/index/Index';
// import { World } from '~/containers/world/World';
import { queryClient } from './queries/query-client';

const World = React.lazy(() => import('~/containers/world/World'));
const MatchOverviewsContainer = React.lazy(() => import('~/containers/index/Index'));

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route index element={<MatchOverviewsContainer />} />
              <Route path="world/:worldName" element={<World />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};


