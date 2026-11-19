import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'jd8fmuu0',
    dataset: 'production'
  },
  // Con dos espacios en el Studio, `sanity schema extract` (de donde sale el schema.json de
  // h2o-web) usa el del catálogo. Para el de distribuidores: --workspace distribuidores.
  schemaExtraction: {
    workspace: 'default',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
