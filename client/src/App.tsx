import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Chat from "@/pages/Chat";
import Settings from "@/pages/Settings";
import Search from "@/pages/Search";
import UserDetail from "@/pages/UserDetail";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <Switch>
      {isAuthenticated ? (
        <>
          <Route path="/" component={Home} />
          <Route path="/profile" component={Profile} />
          <Route path="/chat" component={Chat} />
          <Route path="/settings" component={Settings} />
          <Route path="/search" component={Search} />
          <Route path="/user" component={UserDetail} />
          <Route component={NotFound} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
