// Coordenadas de Caconde
const CACONDE_LAT = -21.5288;
const CACONDE_LNG = -46.6438;

// Variáveis para controlar se os mapas já foram inicializados
let homeMapInitialized = false;
let complaintMapInitialized = false;

// Objeto para gerenciar os mapas
const MapManager = {
  // Inicializar o mapa da home
  initializeHomeMap: function() {
    console.log("[MapManager] Inicializando mapa da home...");
    
    // Verificar se o Leaflet está disponível
    if (typeof L === 'undefined') {
      console.error("[MapManager] Leaflet não está disponível!");
      return;
    }
    
    // Verificar se o elemento do mapa existe
    const mapElement = document.getElementById('home-map');
    if (!mapElement) {
      console.error("[MapManager] Elemento do mapa da home não encontrado!");
      return;
    }
    
    try {
      // Verificar se o mapa já está inicializado
      if (window.homeMap && homeMapInitialized) {
        console.log("[MapManager] Mapa da home já inicializado, atualizando tamanho...");
        window.homeMap.invalidateSize();
        
        // Disparar evento para adicionar marcadores
        const mapInitializedEvent = new CustomEvent('homeMapInitialized');
        document.dispatchEvent(mapInitializedEvent);
        return;
      }
      
      // Limpar mapa anterior se existir
      this.cleanupHomeMap();
      
      // Notificar que o mapa foi redefinido
      const mapResetEvent = new CustomEvent('homeMapReset');
      document.dispatchEvent(mapResetEvent);
      
      console.log("[MapManager] Criando mapa da home com coordenadas de Caconde:", CACONDE_LAT, CACONDE_LNG);
      
      // Inicializar o mapa com as coordenadas de Caconde
      window.homeMap = L.map('home-map').setView([CACONDE_LAT, CACONDE_LNG], 13);
      homeMapInitialized = true;
      
      // Adicionar camada de tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(window.homeMap);
      
      // Disparar um evento personalizado para notificar que o mapa foi inicializado
      // Isso permitirá que os scripts específicos da página adicionem marcadores
      const mapInitializedEvent = new CustomEvent('homeMapInitialized');
      document.dispatchEvent(mapInitializedEvent);
      
      // Forçar a renderização do mapa
      setTimeout(() => {
        if (window.homeMap) {
          window.homeMap.invalidateSize();
          console.log("[MapManager] Mapa da home inicializado com sucesso!");
          
          // Disparar evento novamente após um pequeno atraso para garantir que os marcadores sejam adicionados
          setTimeout(() => {
            const mapInitializedEvent = new CustomEvent('homeMapInitialized');
            document.dispatchEvent(mapInitializedEvent);
          }, 100);
        }
      }, 300);
    } catch (error) {
      console.error("[MapManager] Erro ao inicializar o mapa da home:", error);
      homeMapInitialized = false;
    }
  },
  
  // Limpar o mapa da home
  cleanupHomeMap: function() {
    if (window.homeMap) {
      console.log("[MapManager] Removendo mapa da home anterior...");
      window.homeMap.remove();
      window.homeMap = null;
      homeMapInitialized = false;
    }
  },
  
  // Inicializar o mapa de reclamações
  initializeComplaintMap: function() {
    console.log("[MapManager] Inicializando mapa de reclamação...");
    
    // Verificar se o Leaflet está disponível
    if (typeof L === 'undefined') {
      console.error("[MapManager] Leaflet não está disponível!");
      return;
    }
    
    // Verificar se o elemento do mapa existe
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error("[MapManager] Elemento do mapa de reclamação não encontrado!");
      return;
    }
    
    try {
      // Verificar se o mapa já está inicializado
      if (window.complaintMap && complaintMapInitialized) {
        console.log("[MapManager] Mapa de reclamação já inicializado, atualizando tamanho...");
        window.complaintMap.invalidateSize();
        return;
      }
      
      // Limpar mapa anterior se existir
      this.cleanupComplaintMap();
      
      // Obter coordenadas do elemento do mapa ou usar as coordenadas de Caconde
      const lat = parseFloat(mapElement.dataset.latitude) || CACONDE_LAT;
      const lng = parseFloat(mapElement.dataset.longitude) || CACONDE_LNG;
      
      console.log("[MapManager] Criando mapa de reclamação com coordenadas:", lat, lng);
      
      // Inicializar o mapa
      window.complaintMap = L.map('map').setView([lat, lng], 13);
      complaintMapInitialized = true;
      
      // Adicionar camada de tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(window.complaintMap);
      
      // Verificar se estamos na página de edição ou criação (com campos de formulário)
      const formMode = document.getElementById('complaint_latitude') !== null;
      
      if (formMode) {
        console.log("[MapManager] Modo de edição detectado, adicionando marcador arrastável...");
        
        // Obter referências aos campos do formulário
        const latitudeInput = document.getElementById('complaint_latitude');
        const longitudeInput = document.getElementById('complaint_longitude');
        const addressInput = document.getElementById('address-input');
        
        // Adicionar marcador arrastável
        window.complaintMarker = L.marker([lat, lng], {
          draggable: true
        }).addTo(window.complaintMap);
        
        // Atualizar coordenadas quando o marcador for movido
        window.complaintMarker.on('dragend', function(e) {
          const latlng = window.complaintMarker.getLatLng();
          
          // Atualizar campos ocultos
          latitudeInput.value = latlng.lat;
          longitudeInput.value = latlng.lng;
          
          // Buscar endereço a partir das coordenadas (geocodificação reversa)
          if (addressInput) {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
              .then(response => response.json())
              .then(data => {
                if (data.display_name) {
                  addressInput.value = data.display_name;
                }
              })
              .catch(error => console.error('[MapManager] Erro ao buscar endereço:', error));
          }
        });
        
        // Definir coordenadas iniciais nos campos ocultos
        latitudeInput.value = lat;
        longitudeInput.value = lng;
      } else {
        console.log("[MapManager] Modo de visualização detectado, adicionando marcador fixo...");
        
        // Adicionar marcador fixo
        L.marker([lat, lng]).addTo(window.complaintMap)
          .bindPopup(mapElement.dataset.title || 'Localização da Reclamação')
          .openPopup();
      }
      
      // Forçar a renderização do mapa
      setTimeout(() => {
        if (window.complaintMap) {
          window.complaintMap.invalidateSize();
          console.log("[MapManager] Mapa de reclamação inicializado com sucesso!");
        }
      }, 300);
    } catch (error) {
      console.error("[MapManager] Erro ao inicializar o mapa de reclamação:", error);
      complaintMapInitialized = false;
    }
  },
  
  // Limpar o mapa de reclamações
  cleanupComplaintMap: function() {
    if (window.complaintMap) {
      console.log("[MapManager] Removendo mapa de reclamação anterior...");
      window.complaintMap.remove();
      window.complaintMap = null;
      complaintMapInitialized = false;
    }
  },
  
  // Inicializar os mapas com base nos elementos presentes na página
  initializeMaps: function() {
    console.log("[MapManager] Inicializando mapas na página atual...");
    
    // Verificar se há um mapa da home na página
    if (document.getElementById('home-map')) {
      this.initializeHomeMap();
    }
    
    // Verificar se há um mapa de reclamação na página
    if (document.getElementById('map')) {
      this.initializeComplaintMap();
    }
  },
  
  // Limpar todos os mapas
  cleanupAllMaps: function() {
    this.cleanupHomeMap();
    this.cleanupComplaintMap();
  },
  
  // Forçar a reinicialização de todos os mapas
  forceReinitializeMaps: function() {
    console.log("[MapManager] Verificando necessidade de reinicialização dos mapas...");
    
    // Verificar se há um mapa da home na página
    if (document.getElementById('home-map')) {
      if (!window.homeMap || !homeMapInitialized) {
        console.log("[MapManager] Mapa da home precisa ser inicializado...");
        this.cleanupHomeMap();
        this.initializeHomeMap();
      } else {
        console.log("[MapManager] Mapa da home já inicializado, atualizando...");
        window.homeMap.invalidateSize();
        
        // Forçar a atualização dos dados ao retornar à home
        if (window.location.pathname === '/' || window.location.pathname === '') {
          console.log("[MapManager] Detectada navegação para a home, forçando atualização dos dados...");
          this.forceHomeDataRefresh();
        }
        
        const mapInitializedEvent = new CustomEvent('homeMapInitialized');
        document.dispatchEvent(mapInitializedEvent);
      }
    }
    
    // Verificar se há um mapa de reclamação na página
    if (document.getElementById('map')) {
      if (!window.complaintMap || !complaintMapInitialized) {
        console.log("[MapManager] Mapa de reclamação precisa ser inicializado...");
        this.cleanupComplaintMap();
        this.initializeComplaintMap();
      } else {
        console.log("[MapManager] Mapa de reclamação já inicializado, atualizando...");
        window.complaintMap.invalidateSize();
      }
    }
  },
  
  // Forçar a atualização dos dados da home
  forceHomeDataRefresh: function() {
    console.log("[MapManager] Forçando atualização dos dados da home...");
    
    // Verificar se estamos na página inicial
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      console.log("[MapManager] Não estamos na página inicial, ignorando atualização de dados.");
      return;
    }
    
    // Verificar se o mapa da home está inicializado
    if (!window.homeMap) {
      console.log("[MapManager] Mapa da home não inicializado, inicializando primeiro...");
      this.initializeHomeMap();
    }
    
    console.log("[MapManager] Buscando dados atualizados via AJAX...");
    
    // Buscar dados atualizados via fetch
    fetch('/?format=json', {
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      cache: 'no-store' // Importante: não usar cache para sempre obter dados atualizados
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar dados atualizados');
      }
      console.log("[MapManager] Resposta recebida, convertendo para JSON...");
      return response.json();
    })
    .then(data => {
      console.log("[MapManager] Dados atualizados recebidos:", data);
      
      if (data && data.complaints) {
        console.log("[MapManager] Total de reclamações recebidas:", data.complaints.length);
        
        // Disparar evento com os dados atualizados
        const dataRefreshEvent = new CustomEvent('homeDataRefreshed', { 
          detail: { 
            complaints: data.complaints,
            timestamp: new Date().getTime()
          } 
        });
        
        console.log("[MapManager] Disparando evento homeDataRefreshed...");
        document.dispatchEvent(dataRefreshEvent);
      } else {
        console.error("[MapManager] Dados recebidos não contêm reclamações:", data);
      }
    })
    .catch(error => {
      console.error("[MapManager] Erro ao atualizar dados:", error);
    });
  }
};

// Executar inicialização imediata dos mapas
console.log("[MapManager] Executando inicialização imediata dos mapas...");
setTimeout(function() {
  MapManager.initializeMaps();
}, 0);

// Inicializar os mapas quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  console.log("[MapManager] DOMContentLoaded - Inicializando mapas...");
  setTimeout(function() {
    MapManager.forceReinitializeMaps();
  }, 100);
});

// Inicializar os mapas quando a página for carregada via Turbo
document.addEventListener('turbo:load', function() {
  console.log("[MapManager] turbo:load - Inicializando mapas...");
  setTimeout(function() {
    MapManager.forceReinitializeMaps();
  }, 100);
});

// Inicializar os mapas quando a página for renderizada via Turbo
document.addEventListener('turbo:render', function() {
  console.log("[MapManager] turbo:render - Inicializando mapas...");
  setTimeout(function() {
    MapManager.forceReinitializeMaps();
  }, 100);
});

// Inicializar os mapas quando a página for visitada via Turbo
document.addEventListener('turbo:visit', function() {
  console.log("[MapManager] turbo:visit - Preparando para inicializar mapas...");
  // Limpar mapas existentes para evitar conflitos
  MapManager.cleanupAllMaps();
  
  // Agendar inicialização após a renderização da página
  setTimeout(function() {
    MapManager.forceReinitializeMaps();
  }, 200);
});

// Limpar os mapas antes de navegar para outra página
document.addEventListener('turbo:before-visit', function() {
  console.log("[MapManager] turbo:before-visit - Limpando mapas...");
  MapManager.cleanupAllMaps();
});

// Adicionar um listener para o evento de mudança de visibilidade da página
document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    console.log("[MapManager] Página visível novamente - Reinicializando mapas...");
    setTimeout(function() {
      MapManager.forceReinitializeMaps();
    }, 100);
  }
});

// Adicionar um listener para o evento de redimensionamento da janela
window.addEventListener('resize', function() {
  console.log("[MapManager] Janela redimensionada - Atualizando tamanho dos mapas...");
  if (window.homeMap) {
    window.homeMap.invalidateSize();
  }
  if (window.complaintMap) {
    window.complaintMap.invalidateSize();
  }
});

export default MapManager;