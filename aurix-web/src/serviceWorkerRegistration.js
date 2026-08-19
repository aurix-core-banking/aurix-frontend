const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function registrar(config) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

      if (isLocalhost) {
        verificarServicoValido(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log('Service Worker está ativo em modo localhost.');
        });
      } else {
        registrarSwValido(swUrl, config);
      }
    });
  }
}

function registrarSwValido(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const swInstalando = registration.installing;
        if (swInstalando == null) {
          return;
        }

        swInstalando.onstatechange = () => {
          if (swInstalando.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('Nova versão disponível. Atualize o aplicativo.');
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              console.log('Conteúdo cacheado para uso offline.');
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Erro ao registrar Service Worker:', error);
    });
}

function verificarServicoValido(swUrl, config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (response.status === 404 || (contentType != null && contentType.indexOf('javascript') === -1)) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registrarSwValido(swUrl, config);
      }
    })
    .catch(() => {
      console.log('Sem conexão. Aplicativo rodando em modo offline.');
    });
}

export function desregistrar() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        return registration.unregister();
      })
      .catch((error) => {
        console.error('Erro ao desregistrar Service Worker:', error);
      });
  }
}

export function registrarParaNotificacoes(config) {
  if ('serviceWorker' in navigator && 'Notification' in window) {
    Notification.requestPermission().then((permissao) => {
      if (permissao === 'granted') {
        console.log('Permissão de notificação concedida.');
        navigator.serviceWorker.ready.then((registration) => {
          if (config && config.onPermissaoConcedida) {
            config.onPermissaoConcedida(registration);
          }
        });
      } else {
        console.log('Permissão de notificação negada.');
      }
    });
  }
}

export function verificarAtualizacao() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        registration.update();
      }
    });
  }
}
