/* eslint-disable react/react-in-jsx-scope */
import { createContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen'
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary.tsx';
import { NotFound } from './components/NotFound.tsx';
import { ApplicationContext, defaultApplicationContext } from './types/AppContext.tsx';
import './css/index.css'

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: DefaultCatchBoundary,
  defaultNotFoundComponent: () => <NotFound />,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const AppContext = createContext<ApplicationContext>(defaultApplicationContext);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppContext.Provider value={defaultApplicationContext}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AppContext.Provider>
  </StrictMode>,
)
