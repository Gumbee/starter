import { useSetLoading } from '@forge/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function useResetLoadingOnRoute() {
  const router = useRouter();
  const setLoading = useSetLoading();

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      setLoading(undefined);
    };

    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);
}
