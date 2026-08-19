import { useState, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';

const usePaginacao = ({
  chave,
  buscarDados,
  tamanhoPaginaInicial = 10,
  opcoesQuery = {},
}) => {
  const queryClient = useQueryClient();
  const [pagina, setPagina] = useState(0);
  const [tamanhoPagina, setTamanhoPagina] = useState(tamanhoPaginaInicial);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const chaveArray = Array.isArray(chave) ? chave : [chave];
  const chaveQuery = [...chaveArray, pagina, tamanhoPagina];

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery(
    chaveQuery,
    async () => {
      const resultado = await buscarDados({
        page: pagina,
        size: tamanhoPagina,
        offset: pagina * tamanhoPagina,
      });

      if (resultado?.total !== undefined) {
        setTotalRegistros(resultado.total);
      } else if (resultado?.totalCount !== undefined) {
        setTotalRegistros(resultado.totalCount);
      }

      return resultado;
    },
    {
      keepPreviousData: true,
      staleTime: 30000,
      ...opcoesQuery,
    }
  );

  const mudarPagina = useCallback((novaPagina) => {
    setPagina(novaPagina);
  }, []);

  const mudarTamanhoPagina = useCallback((novoTamanho) => {
    setTamanhoPagina(novoTamanho);
    setPagina(0);
  }, []);

  const totalPaginas = Math.ceil(totalRegistros / tamanhoPagina);

  useEffect(() => {
    if (data?.total !== undefined) {
      setTotalRegistros(data.total);
    } else if (data?.totalCount !== undefined) {
      setTotalRegistros(data.totalCount);
    }
  }, [data]);

  return {
    dados: data,
    itens: data?.data || data?.content || data?.items || [],
    pagina,
    tamanhoPagina,
    totalRegistros,
    totalPaginas,
    carregando: isLoading,
    buscando: isFetching,
    erro,
    mudarPagina,
    mudarTamanhoPagina,
    refetch,
  };
};

export default usePaginacao;
