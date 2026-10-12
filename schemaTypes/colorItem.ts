import {createElement} from 'react'
import {defineArrayMember, defineField} from 'sanity'

export default defineArrayMember({
  name: 'colorItem',
  title: 'Color',
  type: 'object',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'valor',
      title: 'Color',
      type: 'color',
      options: {disableAlpha: true},
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'nombre', hex: 'valor.hex'},
    prepare: ({title, hex}) => ({
      title,
      subtitle: hex,
      media: createElement('span', {
        style: {
          display: 'block',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: hex,
        },
      }),
    }),
  },
})
