// Este arquivo foi substituído pelo map_manager.js
// Mantido apenas para compatibilidade com código existente
// Redireciona para o novo gerenciador de mapas

console.log("[ComplaintMap] Este arquivo foi substituído pelo map_manager.js");

// Importar o novo gerenciador de mapas
import MapManager from 'map_manager';

// Função para inicializar o mapa de reclamações (compatibilidade)
function initializeComplaintMap() {
  console.log("[ComplaintMap] Redirecionando para MapManager.initializeComplaintMap()");
  MapManager.initializeComplaintMap();
}

// Função para limpar o mapa (compatibilidade)
function cleanupMap() {
  console.log("[ComplaintMap] Redirecionando para MapManager.cleanupComplaintMap()");
  MapManager.cleanupComplaintMap();
}

// Não adicionar event listeners aqui, pois já estão no map_manager.js