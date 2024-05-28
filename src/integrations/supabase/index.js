import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from "react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

// Types
export type Foo = {
    id: number;
    title: string;
    bars?: Bar[];
};

export type Bar = {
    id: number;
    foo_id: number;
};

// Hooks
export const useFoos = () => useQuery({
    queryKey: ['foos'],
    queryFn: () => fromSupabase(supabase.from('foos').select('*, bars(*)')),
});

export const useAddFoo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newFoo) => fromSupabase(supabase.from('foos').insert([newFoo])),
        onSuccess: () => {
            queryClient.invalidateQueries('foos');
        },
    });
};

export const useBars = (fooId) => useQuery({
    queryKey: ['bars', fooId],
    queryFn: () => fromSupabase(supabase.from('bars').select('*').eq('foo_id', fooId)),
});

export const useAddBar = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newBar) => fromSupabase(supabase.from('bars').insert([newBar])),
        onSuccess: () => {
            queryClient.invalidateQueries('bars');
        },
    });
};