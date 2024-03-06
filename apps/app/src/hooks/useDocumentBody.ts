import { useEffect, useState } from 'react';

export function useDocumentBody() {
  const [body, setBody] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setBody(document.body.querySelector<HTMLElement>('[data-notifications]'));
  }, []);

  return body;
}
