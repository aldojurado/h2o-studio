// Crea distribuidores de prueba en el dataset privado "distribuidores".
//
// Uso (con la sesión del CLI de Sanity, sin token aparte):
//   npx sanity exec scripts/distribuidores-prueba.ts --with-user-token
//
// Si ya existe un distribuidor con el mismo celular, lo omite (correrlo otra vez no duplica).
// Los datos son ficticios; los correos usan example.com.

import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'}).withConfig({dataset: 'distribuidores'})

const PRUEBA = [
  {
    nombre: 'Laura Méndez Ortiz',
    celular: '5500000001',
    correo: 'laura.prueba@example.com',
    empresa: 'Óptica Visión Clara (prueba)',
    tipo_negocio: 'optica',
    estado: 'Ciudad de México',
    ciudad: 'Coyoacán',
    codigo_postal: '04000',
    estatus: 'activo',
  },
  {
    nombre: 'Jorge Ramírez Salas',
    celular: '3300000002',
    correo: 'jorge.prueba@example.com',
    tipo_negocio: 'optometrista',
    estado: 'Jalisco',
    ciudad: 'Guadalajara',
    estatus: 'activo',
  },
  {
    // Sirve para probar que un distribuidor suspendido no puede enviar pedidos.
    nombre: 'Mariana Torres Vega',
    celular: '8100000003',
    correo: 'mariana.prueba@example.com',
    empresa: 'Laboratorio Norte (prueba)',
    tipo_negocio: 'laboratorio',
    estado: 'Nuevo León',
    ciudad: 'Monterrey',
    estatus: 'suspendido',
  },
]

for (const datos of PRUEBA) {
  const existe = await client.fetch(`count(*[_type == "distribuidor" && celular == $celular])`, {
    celular: datos.celular,
  })
  if (existe > 0) {
    console.log(`Ya existe ${datos.celular}, se omite`)
    continue
  }
  const creado = await client.create({
    _type: 'distribuidor',
    ...datos,
    acepta_aviso_privacidad: true,
    fecha_registro: new Date().toISOString(),
    notas: 'Distribuidor de prueba: se puede borrar.',
  })
  console.log(`Creado ${datos.nombre} (${datos.celular}): ${creado._id}`)
}
