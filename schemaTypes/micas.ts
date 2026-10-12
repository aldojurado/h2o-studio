import {defineField, defineType, type SanityDocument} from 'sanity'
import colorItem from './colorItem'
import {defineRango} from './rango'

const esBase = (doc: SanityDocument | undefined) => doc?.base === true

export default defineType({
  name: 'micas',
  title: 'Micas',
  type: 'document',
  fields: [
    defineField({
      name: 'marca',
      title: 'Marca',
      type: 'string',
      options: {list: ['H2O']},
      initialValue: 'H2O',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tipo_de_mica',
      title: 'Tipo de mica',
      type: 'string',
      options: {
        list: [
          {title: 'Monofocal', value: 'monofocal'},
          {title: 'Bifocal', value: 'bifocal'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tipo_bifocal',
      title: 'Tipo de bifocal',
      type: 'string',
      options: {list: ['Flat-top', 'Blend', 'Progresivo', 'Ejecutivo']},
      hidden: ({document}) => document?.tipo_de_mica !== 'bifocal',
      validation: (rule) =>
        rule.custom((value, context) =>
          context.document?.tipo_de_mica === 'bifocal' && !value
            ? 'Elige el tipo de bifocal'
            : true,
        ),
    }),
    defineField({
      name: 'base',
      title: 'Base',
      type: 'boolean',
      initialValue: false,
    }),
    defineRango({
      name: 'rango_base',
      title: 'Rango de base',
      paso: 1,
      minimo: 0,
      aplica: esBase,
    }),
    defineField({
      name: 'index',
      title: 'Index',
      type: 'string',
      options: {list: ['CR', 'Hi-index', 'Poly', '1.67', '1.71', '1.74', 'Cristal']},
      validation: (rule) => rule.required(),
    }),
    defineRango({
      name: 'rango_esfera',
      title: 'Rango de esfera',
      paso: 0.25,
      aplica: (doc) => !esBase(doc),
    }),
    defineRango({
      name: 'rango_cilindro',
      title: 'Rango de cilindro',
      description: '(Opcional)',
      paso: 0.25,
      obligatorio: false,
      aplica: (doc) => !esBase(doc) && doc?.tipo_de_mica === 'monofocal',
    }),
    defineRango({
      name: 'rango_adicion',
      title: 'Rango de adición',
      paso: 0.25,
      aplica: (doc) => doc?.tipo_de_mica === 'bifocal',
    }),
    defineField({
      name: 'tratamiento',
      title: 'Tratamiento',
      type: 'string',
      options: {list: ['Blanco', 'AR', 'Blue Ray', 'Espejo']},
    }),
    defineField({
      name: 'tratamiento_fotosensible',
      title: 'Tratamiento fotosensible',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'tipo_fotosensible',
      title: 'Tipo de tratamiento fotosensible',
      type: 'string',
      options: {
        list: [
          {title: 'Polarizado', value: 'polarizado'},
          {title: 'Fotocromático', value: 'fotocromático'},
        ],
      },
      hidden: ({document}) => !document?.tratamiento_fotosensible,
      validation: (rule) =>
        rule.custom((value, context) =>
          context.document?.tratamiento_fotosensible && !value
            ? 'Elige el tipo de tratamiento fotosensible'
            : true,
        ),
    }),

    defineField({
      name: 'colores',
      title: 'Colores disponibles',
      type: 'array',
      of: [colorItem],
    }),
    defineField({
      name: 'imagen',
      title: 'Cargar foto',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {
      marca: 'marca',
      tipo: 'tipo_de_mica',
      bifocal: 'tipo_bifocal',
      imagen: 'imagen',
    },
    prepare: ({marca, tipo, bifocal, imagen}) => ({
      title: marca,
      subtitle: bifocal ? `${tipo} · ${bifocal}` : tipo,
      media: imagen,
    }),
  },
})
