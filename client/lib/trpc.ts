'use client';
import type { AppRouter } from '../../server/src';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import type { inferRouterOutputs } from '@trpc/server';

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

export type Outputs = inferRouterOutputs<AppRouter>;
