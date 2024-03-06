import {
  CSSProperties,
  Children,
  FC,
  ForwardRefExoticComponent,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  RefAttributes,
  forwardRef,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useStepper } from './hooks/useStepper';
import clsx from 'clsx';
import { Maybe, Optional } from '@forge/common/types';
import { useIsomporphicLayoutEffect } from '@forge/common/hooks';
import { AnimationControls, animate } from 'motion';

type StepperProps = PropsWithChildren<{
  className?: string;
  initialStep?: string;
  transitionHeight?: boolean;
  id: string;
}>;

type StepProps = PropsWithChildren<{
  className?: string;
  style?: CSSProperties;
  step: string;
  inDuration?: number;
  outDuration?: number;
  inDelay?: number;
  outDelay?: number;
  transitions?: ('fade' | 'slide')[];
}>;

type Dimensions = {
  px: number;
  py: number;
  width: number;
  height: number;
};

const getOptions = (props: Optional<StepProps>) => {
  const options = {
    inDuration: props?.inDuration ?? 1300,
    outDuration: props?.outDuration ?? 800,
    inDelay: props?.inDelay ?? 450,
    outDelay: props?.outDelay ?? 0,
    transitions: props?.transitions ?? ['slide', 'fade'],
  };

  return options;
};

export const Stepper: FC<StepperProps> & { Step: ForwardRefExoticComponent<StepProps & RefAttributes<HTMLDivElement>> } = ({
  id,
  children,
  initialStep,
  transitionHeight = false,
  className,
}) => {
  const { step, direction, goToStep } = useStepper(id);
  const animator = useRef<Maybe<AnimationControls>>(undefined);
  const prevStep = useRef<Maybe<string>>(undefined);
  const cache = useRef<Record<string, Dimensions>>({});
  const scrollCache = useRef<number>(0);

  // extract all steps from children
  const getProps = (el: any): Optional<StepProps> => {
    if (!isValidElement<PropsWithChildren<{ step: string }>>(el)) return undefined;

    if (el.props.step) return el.props;

    if (typeof el.type === 'function') {
      return getProps((el.type as (props: any) => ReactNode)(el.props));
    }

    return Children.map(el.props.children, getProps)?.[0];
  };

  const steps =
    Children.map(children, (child) => {
      const props = getProps(child);

      if (!props) return undefined;

      return {
        [props.step]: { child, props },
      };
    })?.reduce((acc, curr) => ({ ...acc, ...curr }), {}) ?? {};

  const stepSafe = step || initialStep || Object.keys(steps)[0];
  const stepOptions = steps[stepSafe];
  const stepChildComponent = stepOptions?.child;

  const options = getOptions(stepOptions?.props);

  useIsomporphicLayoutEffect(() => {
    if (!step) {
      goToStep(initialStep ?? Object.keys(steps)[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const updateCache = (key: string, el: Maybe<HTMLElement>) => {
    if (el) {
      const elRect = el.getBoundingClientRect();

      const width = elRect.width;

      cache.current[key] = {
        px: elRect.x,
        py: elRect.y,
        width,
        height: elRect.height,
      };
    }
  };

  if (typeof window !== 'undefined') {
    if (prevStep.current && prevStep.current !== stepSafe) {
      updateCache('stepperrootcomp', document.querySelector<HTMLElement>(`[data-stepper="${id}"]`));
      updateCache(prevStep.current, document.querySelector<HTMLElement>(`[data-step="${prevStep.current}"]`));
      scrollCache.current = window.scrollY;
    }

    prevStep.current = stepSafe;
  }

  return (
    <>
      <TransitionGroup data-stepper={id} data-direction={direction} className={clsx('relative', className)}>
        <CSSTransition
          key={stepSafe}
          timeout={{ enter: options.inDuration + options.inDelay, exit: options.outDuration + options.outDelay }}
          classNames={clsx('step')}
          onExit={(el) => {
            const dim = cache.current[stepSafe];

            if (el && dim) {
              el.style.left = `0px`;
              el.style.top = `0px`;

              const scrollJump = window.scrollY - scrollCache.current;

              const rect = el.getBoundingClientRect();

              const dx = dim.px - rect.x;
              const dy = dim.py - rect.y - scrollJump;

              el.style.width = `${dim.width}px`;
              el.style.height = `${dim.height}px`;
              el.style.left = `${dx}px`;
              el.style.top = `${dy}px`;

              setTimeout(() => {
                window.scrollTo({
                  top: scrollCache.current,
                  behavior: 'instant',
                });
              }, 0);
            }

            const rootCache = cache.current['stepperrootcomp'];

            if (rootCache && transitionHeight) {
              const root = document.querySelector<HTMLElement>(`[data-stepper="${id}"]`);
              if (root) {
                animator.current?.stop();
                root.style.height = '';
                const rect = root.getBoundingClientRect();

                animator.current = animate(
                  [root],
                  {
                    height: [`${rootCache.height}px`, `${rect.height}px`],
                  },
                  {
                    easing: [0.13, 0.72, 0.29, 0.98],
                    duration: (options.inDuration + options.inDelay) / 1000,
                  },
                );

                animator.current?.finished.then(() => {
                  root.style.height = '';
                });
              }
            }
          }}
        >
          {stepChildComponent ?? <></>}
        </CSSTransition>
      </TransitionGroup>
    </>
  );
};

Stepper.Step = forwardRef<HTMLDivElement, StepProps>(({ children, ...props }, ref) => {
  const options = getOptions(props);

  return (
    <div
      ref={ref}
      data-step={props.step}
      className={clsx(...options.transitions.map((x) => `step__${x}`), props.className)}
      style={{
        ['--in-duration' as any]: `${options.inDuration}ms`,
        ['--out-duration' as any]: `${options.outDuration}ms`,
        ['--in-delay' as any]: `${options.inDelay}ms`,
        ['--out-delay' as any]: `${options.outDelay}ms`,
      }}
    >
      {children}
    </div>
  );
});

Stepper.Step.displayName = 'Step';
