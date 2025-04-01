import {Stack} from 'expo-router';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import './global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 mins
    },
    mutations: {
      retry: 0,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        {/* <Stack.Screen name="search" options={{headerShown: false}} /> */}
        <Stack.Screen name="movies/[id]" options={{headerShown: false}} />
      </Stack>
    </QueryClientProvider>
  );
}
