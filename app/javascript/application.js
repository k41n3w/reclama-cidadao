import "@hotwired/turbo-rails"
import "controllers"
import "map_manager"
import "home_animations"

document.addEventListener('turbo:before-frame-render', () => {
    console.log("load aqui")
    const dropdownToggle = document.getElementById('navbarDropdown');
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', (event) => {
            event.preventDefault(); // Previne o comportamento padrão
            // Aqui você pode adicionar a lógica para atualizar o conteúdo do dropdown, se necessário
            // Exemplo: re-inicializar o dropdown do Bootstrap
            if (typeof bootstrap !== 'undefined') {
                const dropdown = new bootstrap.Dropdown(dropdownToggle);
                dropdown.toggle(); // Alterna o estado do dropdown
            }
        });
    }
});

// Adicionar eventos para detectar navegação para a home
document.addEventListener('turbo:load', function() {
  console.log("[Application] turbo:load - Caminho atual:", window.location.pathname);
  
  // Verificar se estamos na página inicial
  if (window.location.pathname === '/' || window.location.pathname === '') {
    console.log("[Application] Navegação para a home detectada, verificando necessidade de atualização...");
    
    // Se o MapManager estiver disponível, forçar a atualização dos dados
    if (typeof MapManager !== 'undefined') {
      console.log("[Application] Chamando MapManager.forceHomeDataRefresh()...");
      setTimeout(function() {
        MapManager.forceHomeDataRefresh();
      }, 300); // Pequeno atraso para garantir que o mapa esteja inicializado
    } else {
      console.error("[Application] MapManager não está disponível!");
    }
  }
});

// Adicionar evento para detectar navegação via Turbo Visit
document.addEventListener('turbo:visit', function(event) {
  console.log("[Application] turbo:visit - Navegando para:", event.detail.url);
  
  // Armazenar a URL anterior para verificar se estamos voltando para a home
  window.previousUrl = window.location.href;
});

// Adicionar evento para detectar quando a navegação é concluída
document.addEventListener('turbo:render', function() {
  console.log("[Application] turbo:render - Caminho atual:", window.location.pathname);
  
  // Verificar se estamos na página inicial após navegar de outra página
  if ((window.location.pathname === '/' || window.location.pathname === '') && 
      window.previousUrl && 
      !window.previousUrl.endsWith('/') && 
      !window.previousUrl.endsWith('3001')) {
    
    console.log("[Application] Retorno para a home detectado, forçando atualização dos dados...");
    
    // Se o MapManager estiver disponível, forçar a atualização dos dados
    if (typeof MapManager !== 'undefined') {
      console.log("[Application] Chamando MapManager.forceHomeDataRefresh() após retorno...");
      setTimeout(function() {
        MapManager.forceHomeDataRefresh();
      }, 500); // Atraso maior para garantir que tudo esteja carregado
    }
  }
});

// Adicionar evento para detectar quando uma ação é concluída (como criar ou editar uma reclamação)
document.addEventListener('turbo:submit-end', function(event) {
  console.log("[Application] turbo:submit-end - Formulário enviado:", event.detail.formSubmission.formElement.action);
  
  // Verificar se o formulário enviado é de uma reclamação (criar ou editar)
  const formAction = event.detail.formSubmission.formElement.action;
  if (formAction && (formAction.includes('/complaints') || formAction.includes('/reclamacoes'))) {
    console.log("[Application] Formulário de reclamação enviado, marcando para atualização...");
    
    // Marcar que precisamos atualizar os dados na próxima vez que voltarmos para a home
    window.needsHomeDataRefresh = true;
  }
});