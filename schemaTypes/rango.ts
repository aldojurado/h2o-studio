import {defineField, type SanityDocument} from 'sanity'

type Rango = {desde?: number; hasta?: number}

// Campo "desde / hasta" que solo se muestra (y valida) cuando `aplica` es true.
export function defineRango({
  name,
  title,
  description,
  paso,
  minimo,
  obligatorio = true,
  aplica,
}: {
  name: string
  title: string
  description?: string
  paso: number
  minimo?: number
  obligatorio?: boolean
  aplica: (document: SanityDocument | undefined) => boolean
}) {
  return defineField({
    name,
    title,
    description,
    type: 'object',
    options: {columns: 2},
    fields: [
      defineField({name: 'desde', title: 'Desde', type: 'number'}),
      defineField({name: 'hasta', title: 'Hasta', type: 'number'}),
    ],
    hidden: ({document}) => !aplica(document),
    validation: (rule) =>
      rule.custom<Rango>((rango, context) => {
        if (!aplica(context.document)) return true
        const {desde, hasta} = rango ?? {}
        if (desde === undefined && hasta === undefined) {
          return obligatorio ? 'Llena "desde" y "hasta"' : true
        }
        if (desde === undefined || hasta === undefined) {
          return obligatorio
            ? 'Llena "desde" y "hasta"'
            : 'Llena "desde" y "hasta", o deja los dos vacíos'
        }
        if ([desde, hasta].some((v) => Math.abs(v / paso - Math.round(v / paso)) > 1e-9)) {
          return `Los valores deben ir de ${paso} en ${paso}`
        }
        if (minimo !== undefined && desde < minimo) {
          return `El valor mínimo es ${minimo}`
        }
        if (desde > hasta) {
          return '"Desde" no puede ser mayor que "hasta"'
        }
        return true
      }),
  })
}
