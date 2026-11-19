import {defineField, defineType} from 'sanity'

// Distribuidores registrados. Vive en el dataset PRIVADO "distribuidores" (espacio
// "Distribuidores" del Studio), no en "production", que es público: aquí hay datos personales.
//
// El sitio (h2o-web) busca el celular al enviar un pedido del carrito: solo los distribuidores
// con estatus "activo" pueden enviarlo. El formulario de registro debe guardar el celular
// normalizado (10 dígitos, sin +52, espacios ni guiones), igual que la validación de abajo.

export const ESTADOS_MX = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
]

const ESTATUS = [
  {title: 'Activo', value: 'activo'},
  {title: 'Suspendido', value: 'suspendido'},
]

export default defineType({
  name: 'distribuidor',
  title: 'Distribuidores',
  type: 'document',
  fieldsets: [
    {name: 'contacto', title: 'Contacto'},
    {name: 'negocio', title: 'Negocio'},
    {name: 'ubicacion', title: 'Ubicación'},
    {name: 'control', title: 'Control interno'},
  ],
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre completo',
      type: 'string',
      fieldset: 'contacto',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'celular',
      title: 'Celular',
      description:
        '10 dígitos, sin +52, espacios ni guiones. Con este número se verifica al enviar un pedido.',
      type: 'string',
      fieldset: 'contacto',
      validation: (rule) =>
        rule.required().custom(async (celular, context) => {
          if (!celular) return true
          if (!/^\d{10}$/.test(celular)) return 'Escribe 10 dígitos, sin espacios ni +52'

          const client = context.getClient({apiVersion: '2025-01-01'})
          const id = context.document?._id?.replace(/^drafts\./, '')
          const repetidos = await client.fetch(
            `count(*[_type == "distribuidor" && celular == $celular && !(_id in [$id, "drafts." + $id])])`,
            {celular, id},
          )
          return repetidos === 0 || 'Ya hay un distribuidor con este celular'
        }),
    }),
    defineField({
      name: 'correo',
      title: 'Correo',
      type: 'string',
      fieldset: 'contacto',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'empresa',
      title: 'Empresa u óptica',
      type: 'string',
      fieldset: 'negocio',
    }),
    defineField({
      name: 'tipo_negocio',
      title: 'Tipo de negocio',
      type: 'string',
      fieldset: 'negocio',
      options: {
        list: [
          {title: 'Óptica', value: 'optica'},
          {title: 'Optometrista independiente', value: 'optometrista'},
          {title: 'Laboratorio óptico', value: 'laboratorio'},
          {title: 'Distribuidor / mayorista', value: 'distribuidor'},
          {title: 'Otro', value: 'otro'},
        ],
      },
    }),
    defineField({
      name: 'rfc',
      title: 'RFC',
      description: 'Opcional, para facturar.',
      type: 'string',
      fieldset: 'negocio',
      validation: (rule) =>
        rule.custom((rfc) =>
          !rfc || /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/.test(rfc.toUpperCase())
            ? true
            : 'RFC no válido (12 o 13 caracteres)',
        ),
    }),
    defineField({
      name: 'estado',
      title: 'Estado',
      type: 'string',
      fieldset: 'ubicacion',
      options: {list: ESTADOS_MX},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ciudad',
      title: 'Ciudad o municipio',
      type: 'string',
      fieldset: 'ubicacion',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'codigo_postal',
      title: 'Código postal',
      type: 'string',
      fieldset: 'ubicacion',
      validation: (rule) =>
        rule.custom((cp) => (!cp || /^\d{5}$/.test(cp) ? true : 'Escribe 5 dígitos')),
    }),
    defineField({
      name: 'estatus',
      title: 'Estatus',
      description: 'Solo los distribuidores activos pueden enviar pedidos desde el carrito.',
      type: 'string',
      fieldset: 'control',
      options: {list: ESTATUS, layout: 'radio', direction: 'horizontal'},
      initialValue: 'activo',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'acepta_aviso_privacidad',
      title: 'Aceptó el aviso de privacidad',
      type: 'boolean',
      fieldset: 'control',
      initialValue: false,
      validation: (rule) =>
        rule.custom((acepta) =>
          acepta ? true : {message: 'El registro no tiene aceptado el aviso de privacidad', level: 'warning'},
        ),
    }),
    defineField({
      name: 'fecha_registro',
      title: 'Fecha de registro',
      type: 'datetime',
      fieldset: 'control',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'notas',
      title: 'Notas internas',
      description: 'Solo las ve el equipo de H2O.',
      type: 'text',
      rows: 3,
      fieldset: 'control',
    }),
  ],
  orderings: [
    {title: 'Nombre', name: 'nombre', by: [{field: 'nombre', direction: 'asc'}]},
    {title: 'Más recientes', name: 'recientes', by: [{field: 'fecha_registro', direction: 'desc'}]},
  ],
  preview: {
    select: {nombre: 'nombre', empresa: 'empresa', celular: 'celular', estatus: 'estatus'},
    prepare: ({nombre, empresa, celular, estatus}) => ({
      title: `${nombre ?? 'Sin nombre'}${estatus === 'suspendido' ? ' (suspendido)' : ''}`,
      subtitle: [empresa, celular].filter(Boolean).join(' · '),
    }),
  },
})
