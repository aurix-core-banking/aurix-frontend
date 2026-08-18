import { Linking } from 'react-native';

const SCHEME = 'aurix';
const UNIVERSAL_LINK_PREFIX = 'https://aurix.com.br';

const DEEP_LINK_ROUTES = {
  PIX_QR_CODE: `${SCHEME}://pix/qrcode`,
  PIX_ENVIAR: `${SCHEME}://pix/enviar`,
  PIX_HISTORICO: `${SCHEME}://pix/historico`,
  PIX_CHAVES: `${SCHEME}://pix/chaves`,
  BOLETO_PAGAR: `${SCHEME}://boleto/pagar`,
  BOLETO_VISUALIZAR: `${SCHEME}://boleto/visualizar`,
  CREDITO_SIMULAR: `${SCHEME}://credito/simular`,
  CREDITO_SOLICITAR: `${SCHEME}://credito/solicitar`,
  TRANSFERENCIA: `${SCHEME}://transferencia`,
  DASHBOARD: `${SCHEME}://dashboard`,
  CONTA_DETALHES: `${SCHEME}://conta/detalhes`,
};

const UNIVERSAL_LINK_ROUTES = {
  PIX_QR_CODE: `${UNIVERSAL_LINK_PREFIX}/pix/qrcode`,
  PIX_ENVIAR: `${UNIVERSAL_LINK_PREFIX}/pix/enviar`,
  PIX_HISTORICO: `${UNIVERSAL_LINK_PREFIX}/pix/historico`,
  PIX_CHAVES: `${UNIVERSAL_LINK_PREFIX}/pix/chaves`,
  BOLETO_PAGAR: `${UNIVERSAL_LINK_PREFIX}/boleto/pagar`,
  BOLETO_VISUALIZAR: `${UNIVERSAL_LINK_PREFIX}/boleto/visualizar`,
  CREDITO_SIMULAR: `${UNIVERSAL_LINK_PREFIX}/credito/simular`,
  CREDITO_SOLICITAR: `${UNIVERSAL_LINK_PREFIX}/credito/solicitar`,
  TRANSFERENCIA: `${UNIVERSAL_LINK_PREFIX}/transferencia`,
  DASHBOARD: `${UNIVERSAL_LINK_PREFIX}/dashboard`,
  CONTA_DETALHES: `${UNIVERSAL_LINK_PREFIX}/conta/detalhes`,
};

export const criarDeepLink = (rota, params = {}) => {
  const urlBase = DEEP_LINK_ROUTES[rota];
  if (!urlBase) {
    console.warn(`Rota desconhecida: ${rota}`);
    return null;
  }

  const queryParams = Object.entries(params)
    .filter(([, valor]) => valor !== undefined && valor !== null && valor !== '')
    .map(([chave, valor]) => `${encodeURIComponent(chave)}=${encodeURIComponent(valor)}`)
    .join('&');

  return queryParams ? `${urlBase}?${queryParams}` : urlBase;
};

export const criarUniversalLink = (rota, params = {}) => {
  const urlBase = UNIVERSAL_LINK_ROUTES[rota];
  if (!urlBase) {
    console.warn(`Rota desconhecida: ${rota}`);
    return null;
  }

  const queryParams = Object.entries(params)
    .filter(([, valor]) => valor !== undefined && valor !== null && valor !== '')
    .map(([chave, valor]) => `${encodeURIComponent(chave)}=${encodeURIComponent(valor)}`)
    .join('&');

  return queryParams ? `${urlBase}?${queryParams}` : urlBase;
};

export const abrirDeepLink = async (url) => {
  try {
    const suportado = await Linking.canOpenURL(url);
    if (suportado) {
      await Linking.openURL(url);
      return true;
    }
    console.warn('Deep link não suportado:', url);
    return false;
  } catch (error) {
    console.error('Erro ao abrir deep link:', error);
    return false;
  }
};

export const registrarListenerDeepLink = (callback) => {
  const handler = ({ url }) => {
    const dados = parseDeepLink(url);
    if (dados) {
      callback(dados);
    }
  };

  Linking.addEventListener('url', handler);

  Linking.getInitialURL().then((url) => {
    if (url) {
      const dados = parseDeepLink(url);
      if (dados) {
        callback(dados);
      }
    }
  });

  return () => {
    Linking.removeEventListener('url', handler);
  };
};

export const parseDeepLink = (url) => {
  if (!url) return null;

  let urlLimpa = url;
  if (url.startsWith(UNIVERSAL_LINK_PREFIX)) {
    urlLimpa = url.replace(UNIVERSAL_LINK_PREFIX, `${SCHEME}://`);
  }

  if (!urlLimpa.startsWith(`${SCHEME}://`)) {
    return null;
  }

  const semEsquema = urlLimpa.replace(`${SCHEME}://`, '');
  const partesRota = semEsquema.split('?');
  const caminho = partesRota[0];
  const queryString = partesRota[1] || '';

  const params = {};
  if (queryString) {
    queryString.split('&').forEach((par) => {
      const [chave, valor] = par.split('=');
      if (chave) {
        params[decodeURIComponent(chave)] = decodeURIComponent(valor || '');
      }
    });
  }

  const rota = mapearCaminho(caminho);

  return { rota, caminho, params };
};

const mapearCaminho = (caminho) => {
  const mapa = {
    'pix/qrcode': 'PIX_QR_CODE',
    'pix/enviar': 'PIX_ENVIAR',
    'pix/historico': 'PIX_HISTORICO',
    'pix/chaves': 'PIX_CHAVES',
    'boleto/pagar': 'BOLETO_PAGAR',
    'boleto/visualizar': 'BOLETO_VISUALIZAR',
    'credito/simular': 'CREDITO_SIMULAR',
    'credito/solicitar': 'CREDITO_SOLICITAR',
    'transferencia': 'TRANSFERENCIA',
    'dashboard': 'DASHBOARD',
    'conta/detalhes': 'CONTA_DETALHES',
  };

  return mapa[caminho] || null;
};

export const obterRotaNavegacao = (rota, params = {}) => {
  const mapaRotas = {
    PIX_QR_CODE: { tela: 'PIX', params: { ...params, tab: 'receber' } },
    PIX_ENVIAR: { tela: 'PIX', params: { ...params, tab: 'enviar' } },
    PIX_HISTORICO: { tela: 'PIX', params: { ...params, tab: 'historico' } },
    PIX_CHAVES: { tela: 'PIX', params: { ...params, tab: 'chaves' } },
    BOLETO_PAGAR: { tela: 'Pagamento', params: { ...params, tipo: 'boleto' } },
    BOLETO_VISUALIZAR: { tela: 'Pagamento', params: { ...params, tipo: 'boleto' } },
    CREDITO_SIMULAR: { tela: 'Credito', params: { ...params, tab: 'simular' } },
    CREDITO_SOLICITAR: { tela: 'Credito', params: { ...params, tab: 'solicitar' } },
    TRANSFERENCIA: { tela: 'Transferencia', params },
    DASHBOARD: { tela: 'Dashboard', params },
    CONTA_DETALHES: { tela: 'Contas', params },
  };

  return mapaRotas[rota] || null;
};

export const criarLinkPixQRCode = (payload) => {
  return criarDeepLink('PIX_QR_CODE', { payload });
};

export const criarLinkBoletoPagar = (codigoBarras) => {
  return criarDeepLink('BOLETO_PAGAR', { codigo: codigoBarras });
};

export const criarLinkCreditoSimular = (valor, prazo) => {
  return criarDeepLink('CREDITO_SIMULAR', { valor, prazo });
};

export const criarUniversalLinkPixQRCode = (payload) => {
  return criarUniversalLink('PIX_QR_CODE', { payload });
};

export const criarUniversalLinkBoletoPagar = (codigoBarras) => {
  return criarUniversalLink('BOLETO_PAGAR', { codigo: codigoBarras });
};

export const criarUniversalLinkCreditoSimular = (valor, prazo) => {
  return criarUniversalLink('CREDITO_SIMULAR', { valor, prazo });
};

export default {
  criarDeepLink,
  criarUniversalLink,
  abrirDeepLink,
  registrarListenerDeepLink,
  parseDeepLink,
  obterRotaNavegacao,
  criarLinkPixQRCode,
  criarLinkBoletoPagar,
  criarLinkCreditoSimular,
  criarUniversalLinkPixQRCode,
  criarUniversalLinkBoletoPagar,
  criarUniversalLinkCreditoSimular,
  DEEP_LINK_ROUTES,
  UNIVERSAL_LINK_ROUTES,
};
