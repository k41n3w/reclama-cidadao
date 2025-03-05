// app/javascript/controllers/map_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container", "latitude", "longitude", "address"]
  
  connect() {
    console.log("MapController conectado!")
    this.initializeMap()
  }
  
  initializeMap() {
    console.log("Inicializando mapa no MapController...")
    
    // Verificar se o Leaflet está disponível
    if (typeof L === 'undefined') {
      console.error("Leaflet não está disponível!")
      return
    }
    
    // Verificar se o container do mapa existe
    if (!this.hasContainerTarget) {
      console.error("Container do mapa não encontrado!")
      return
    }
    
    // Coordenadas de Caconde
    const cacondeLat = -21.5288
    const cacondeLng = -46.6438
    
    try {
      // Inicializar o mapa
      this.map = L.map(this.containerTarget).setView([cacondeLat, cacondeLng], 13)
      
      // Adicionar camada de tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map)
      
      // Adicionar marcador inicial
      this.marker = L.marker([cacondeLat, cacondeLng], {
        draggable: true
      }).addTo(this.map)
      
      // Atualizar coordenadas quando o marcador for movido
      this.marker.on('dragend', this.updateCoordinates.bind(this))
      
      // Definir coordenadas iniciais
      this.updateCoordinates({ lat: cacondeLat, lng: cacondeLng })
      
      // Forçar a renderização do mapa
      setTimeout(() => {
        this.map.invalidateSize()
        console.log("Tamanho do mapa invalidado para forçar renderização")
      }, 100)
      
      console.log("Mapa inicializado com sucesso!")
    } catch (error) {
      console.error("Erro ao inicializar o mapa:", error)
    }
  }
  
  updateCoordinates(event) {
    const latlng = event.target ? event.target.getLatLng() : event
    
    if (this.hasLatitudeTarget && this.hasLongitudeTarget) {
      this.latitudeTarget.value = latlng.lat
      this.longitudeTarget.value = latlng.lng
      
      // Buscar endereço a partir das coordenadas (geocodificação reversa)
      if (this.hasAddressTarget) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
          .then(response => response.json())
          .then(data => {
            if (data.display_name) {
              this.addressTarget.value = data.display_name
            }
          })
          .catch(error => console.error('Erro ao buscar endereço:', error))
      }
    }
  }
  
  setDefaultCoordinates(event) {
    event.preventDefault()
    
    // Coordenadas de Caconde
    const cacondeLat = -21.5288
    const cacondeLng = -46.6438
    
    if (this.map && this.marker) {
      this.marker.setLatLng([cacondeLat, cacondeLng])
      this.map.setView([cacondeLat, cacondeLng], 13)
      this.updateCoordinates({ lat: cacondeLat, lng: cacondeLng })
    }
  }
}