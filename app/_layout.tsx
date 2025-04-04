import {Stack} from 'expo-router';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
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
    <>
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        <StatusBar />
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}} />
            <Stack.Screen name="movies/[id]" options={{headerShown: false}} />
          </Stack>
        </QueryClientProvider>
      </SafeAreaView>
    </>
  );
}
