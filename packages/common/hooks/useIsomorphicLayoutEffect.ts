import { useEffect, useLayoutEffect } from 'react';

export const useIsomporphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
