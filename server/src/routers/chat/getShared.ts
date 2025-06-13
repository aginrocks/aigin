import { publicProcedure } from '@/trpc';
import { Share } from '@models/share';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const getShared = publicProcedure
    .input(
        z.object({
            uuid: z.string().uuid(),
        })
    )
    .query(async ({ input }) => {
        const chat = await Share.findOne(
            {
                uuid: input.uuid,
            },
            {
                user: 0,
                'messages.createdAt': 0,
            }
        );

        if (!chat)
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Shared chat not found',
            });

        return chat;
    });
