import { CollectionConfig } from "payload";

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  fields: [
    {
      name: 'from',
      type: 'text',
    },
    {
        name:'to',
        type:'relationship',
        relationTo:['users','media']
    }
  ],
}