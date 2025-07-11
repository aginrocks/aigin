import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error: any) => {
                // Don't retry on 4xx errors
                if (error?.status == 401) {
                    window.location.href = '/api/login';
                } else {
                    console.error('Mutation error:', error);
                }
                return failureCount < 3;
            },
        },
        mutations: {
            onError: (error: Error) => {
                console.log('Mutation error:', error);

                // Handle global mutation errors here
                if (error.message.includes('You must be logged in to access this resource.')) {
                    window.location.href = '/api/login';
                } else {
                    console.error('Mutation error:', error);
                }
            },
        },
    },
});
