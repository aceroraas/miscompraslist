import { render } from 'preact'
import './index.css'
import { App } from './app.jsx'

console.log('Iniciando aplicación...')

const rootElement = document.getElementById('app')

if (!rootElement) {
  console.error('No se encontró el elemento con id "app" en el DOM')
} else {
  console.log('Elemento raíz encontrado:', rootElement)
  render(<App />, rootElement)
  console.log('Aplicación renderizada')
}
