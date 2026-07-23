import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider } from '@/context/auth-context';
import AppLayout from '@/components/layout/AppLayout';
import Home from '@/pages/Home';
import Tasks from '@/pages/Tasks';
import Submit from '@/pages/Submit';
import Requests from '@/pages/Requests';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

// BASE_URL задаётся через VITE_BASE_PATH в vite.config.ts
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/submit" component={Submit} />
        <Route path="/requests" component={Requests} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter base={base}>
          <Router />
        </WouterRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
