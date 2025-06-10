'use client';
import type { AppRouter } from '../../server/src';
import { createTRPCContext } from '@trpc/tanstack-react-query';

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();
