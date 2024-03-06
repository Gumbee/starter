import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';

type PageLoadingBarProps = {};

export const PageLoadingBar: FC<PageLoadingBarProps> = ({}) => {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // START VALUE - WHEN LOADING WILL START
    router.events.on('routeChangeStart', () => {
      setProgress(40);
    });

    // COMPLETE VALUE - WHEN LOADING IS FINISHED
    router.events.on('routeChangeComplete', () => {
      setProgress(100);
    });

    // RESET VALUE - WHEN LOADING IS CANCELLED
    router.events.on('routeChangeError', () => {
      setProgress(0);
    });

    return () => {
      router.events.off('routeChangeStart', () => {
        setProgress(40);
      });
      router.events.off('routeChangeComplete', () => {
        setProgress(100);
      });
      router.events.off('routeChangeError', () => {
        setProgress(0);
      });
    };
  }, [router]);

  return (
    <LoadingBar
      color="#E9BB1A"
      progress={progress}
      waitingTime={400}
      onLoaderFinished={() => {
        setProgress(0);
      }}
    />
  );
};
