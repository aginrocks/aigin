import { OnboardingPage } from '@/components/onboarding';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
    return (
        <OnboardingPage className="h-120">
            <div className="w-full h-full flex flex-col justify-center items-center gap-5">
                <>
                    <img src="/logo-dark.svg" className="not-dark:hidden w-30" />
                    <img src="/logo-light.svg" className="dark:hidden w-30" />
                </>
                <Link href="/api/login">
                    <Button size="xl" variant="outline">
                        Log in or sign up
                    </Button>
                </Link>
            </div>
        </OnboardingPage>
    );
}
