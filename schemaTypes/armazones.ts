import {defineField, defineType} from 'sanity'
import colorItem from './colorItem'

export default defineType({
  name: 'armazones',
  title: 'Armazones',
  type: 'document',
  fields: [
    defineField({
      name: 'marca',
      title: 'Marca',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'modelo',
      title: 'Modelo',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
    }),
    defineField({
      name: 'medida',
      title: 'Medida (mm)',
      type: 'object',
      fields: [
        defineField({name: 'ancho_de_lente', title: 'Ancho de lente', type: 'number'}),
        defineField({name: 'ancho_de_puente', title: 'Ancho de puente', type: 'number'}),
        defineField({name: 'alto_del_lente', title: 'Alto del lente', type: 'number'}),
        defineField({name: 'largo_de_patilla', title: 'Largo de patilla', type: 'number'}),
      ],
    }),
    defineField({
      name: 'colores',
      title: 'Colores',
      type: 'array',
      of: [colorItem],
    }),
    defineField({
      name: 'imagen',
      title: 'Imagen',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {title: 'marca', subtitle: 'modelo', media: 'imagen'},
  },
})
