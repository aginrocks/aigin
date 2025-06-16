import { protectedProcedure } from '@/trpc';
import { Model, TModel } from '@models/model';
import { z } from 'zod';

export const get = protectedProcedure
    .input(
        z.object({
            includeOther: z.boolean().optional().default(false),
        })
    )
    .query(async ({ input }) => {
        const models = await Model.find<TModel>({
            ...(input.includeOther ? {} : { category: 'flagship' }),
        }).lean();

        return models as TModel[];
    });
