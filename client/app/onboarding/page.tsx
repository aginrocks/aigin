'use client';
import { Button } from '@/components/ui/button';
import { Feature, OnboardingHeader, OnboardingPage } from '@components/onboarding';
import {
    IconArrowRight,
    IconCloud,
    IconCode,
    IconKey,
    IconMessage,
    IconSparkles,
    IconTool,
} from '@tabler/icons-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Welcome from '@/components/onboarding/pages/Welcome';
import ProvidersSetup from '@/components/onboarding/pages/ProvidersSetup';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@lib/trpc';
import ApplicationsSetup from '@/components/onboarding/pages/ApplicationsSetup';

export default function Page() {
    const trpc = useTRPC();

    const [page, setPage] = useState<'welcome' | 'providers' | 'apps'>('welcome');

    useQuery(trpc.models.providers.get.queryOptions());
    return (
        <OnboardingPage>
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={page}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                >
                    {page === 'welcome' && (
                        <Welcome
                            onClick={() => {
                                setPage('providers');
                            }}
                        />
                    )}
                    {page === 'providers' && (
                        <ProvidersSetup
                            onClick={() => {
                                setPage('apps');
                            }}
                        />
                    )}
                    {page === 'apps' && <ApplicationsSetup />}
                </motion.div>
            </AnimatePresence>
        </OnboardingPage>
    );
}
