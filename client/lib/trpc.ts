'use client';
import type { AppRouter } from '../../server/src';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import type { inferRouterOutputs, inferRouterInputs } from '@trpc/server';

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

export type Outputs = inferRouterOutputs<AppRouter>;
export type Inputs = inferRouterInputs<AppRouter>;

export type generateChatOutput = Outputs['chat']['generate'];

export type generateChatInputs = Inputs['chat']['generate'];

export type GetModelsOutput = Outputs['models']['get'];
