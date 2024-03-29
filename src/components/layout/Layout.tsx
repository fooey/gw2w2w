import React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Footer } from '~/components/layout/Footer';
import { Header } from './Header';

const ErrorFallback: React.FC<FallbackProps> = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={console.error.bind(null, 'ERROR BOUNDARY')}>
      <LayoutContent>{children}</LayoutContent>
    </ErrorBoundary>
  );
};

export const LayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="absolute inset-0 flex min-h-screen flex-col gap-8">
      <Header />
      <main className="flex-auto">{children}</main>
      <Footer />
    </div>
  );
};
