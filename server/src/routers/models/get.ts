import { protectedProcedure } from '@/trpc';
import { Model } from '@models/model';
import { z } from 'zod';

export const get = protectedProcedure
    .input(
        z.object({
            includeOther: z.boolean().optional().default(false),
        })
    )
    .query(async ({ input }) => {
        const models = await Model.find({
            ...(input.includeOther ? {} : { category: 'flagship' }),
        });

        return models;
    });
