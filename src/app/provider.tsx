"use client";

import { supabase } from "@/utils/supabase/client";
import { theme } from "./theme";
import { Flex, Loader, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AppProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
});

export function AppProvider({ children }: AppProviderProps) {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log(">>> event", event);
      console.log(">>> session", session);
    });
  }, []);

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MantineProvider>
  );
}
