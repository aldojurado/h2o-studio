import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {distribuidorTypes, schemaTypes} from './schemaTypes'

const projectId = 'jd8fmuu0'

// Dos espacios (selector arriba a la izquierda del Studio):
// - Catálogo: micas y armazones, en "production" (público; el sitio lo lee sin token).
// - Distribuidores: registro de distribuidores, en "distribuidores" (privado).
export default defineConfig([
  {
    name: 'default',
    title: 'Catálogo',
    basePath: '/catalogo',
    projectId,
    dataset: 'production',
    plugins: [structureTool(), visionTool(), colorInput()],
    schema: {types: schemaTypes},
  },
  {
    name: 'distribuidores',
    title: 'Distribuidores',
    basePath: '/distribuidores',
    projectId,
    dataset: 'distribuidores',
    plugins: [structureTool(), visionTool()],
    schema: {types: distribuidorTypes},
  },
])
