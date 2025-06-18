import { protectedProcedure } from '@/trpc';
import { mcpActionsQueue } from '@ai/mcp/mcp-app';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const confirmMCPCall = protectedProcedure
    .input(
        z.object({
            callId: z.string(),
            canContinue: z.boolean(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const call = mcpActionsQueue.get(input.callId);
        if (!call || call.userId !== ctx.user._id.toString()) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Call not found or user mismatch',
            });
        }

        call.resolve(input.canContinue);
        mcpActionsQueue.delete(input.callId);

        return {
            success: true,
            message: input.canContinue ? 'Call confirmed' : 'Call cancelled',
        };
    });
