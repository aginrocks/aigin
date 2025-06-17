import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="w-screen h-screen flex flex-col gap-7 items-center justify-center relative">
            <div className="absolute -z-10 inset-0 rounded-sm blur-[180px] opacity-60 firefox:blur-[300px] firefox:opacity-40">
                <div className="w-full h-full bg-transparent text-transparent bg-gradient-to-r from-chart-2 via-chart-4 to-chart-5 [clip-path:polygon(0_0,100%_0,0_100%)]" />
                <div className="absolute bg-transparent text-transparent bg-gradient-to-r from-chart-4 via-chart-5 to-chart-1 w-[70%] h-[70%] bottom-0 right-0 [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
            </div>
            <>
                <img src="/logo-dark.svg" className="not-dark:hidden w-xs" />
                <img src="/logo-light.svg" className="dark:hidden w-xs" />
            </>
            <Link href="/api/login">
                <Button size={'xl'} variant={'outline'}>
                    Login or sign up
                </Button>
            </Link>
        </div>
    );
}
