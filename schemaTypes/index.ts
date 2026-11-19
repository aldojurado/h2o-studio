import micas from './micas'
import armazones from './armazones'
import distribuidor from './distribuidor'

// Catálogo (dataset público "production").
export const schemaTypes = [micas, armazones]

// Distribuidores (dataset privado "distribuidores"): datos personales, en un espacio aparte
// para que no se puedan crear por error en el dataset público.
export const distribuidorTypes = [distribuidor]
