import { useState, useEffect } from 'react';

const useDebounce = (valor, atraso = 300) => {
  const [valorDebounced, setValorDebounced] = useState(valor);

  useEffect(() => {
    const timer = setTimeout(() => {
      setValorDebounced(valor);
    }, atraso);

    return () => {
      clearTimeout(timer);
    };
  }, [valor, atraso]);

  return valorDebounced;
};

export default useDebounce;
