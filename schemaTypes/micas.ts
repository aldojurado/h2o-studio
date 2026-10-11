import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'micas',
  title: 'Micas',
  type: 'document',
  fields: [
    defineField({
      name: 'marca',
      title: 'Marca',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tipo_de_mica',
      title: 'Tipo de mica',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
    }),
    defineField({
      name: 'tratamiento',
      title: 'Tratamiento',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'marca', subtitle: 'tipo_de_mica'},
  },
})
