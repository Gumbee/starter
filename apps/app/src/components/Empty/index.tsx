import { FC } from 'react';

// empty component (used to minimize bundle size by dynamically importing this component instead of actual components
// that are not used in the current build)
export const Empty: FC = ({}) => {
  return null;
};

module.exports = new Proxy(
  {},
  {
    get: function (target, name) {
      return Empty;
    },
  },
);
