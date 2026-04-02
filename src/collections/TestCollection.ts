import { CollectionConfig } from "payload";
import { formatConcatenatedFields } from "./formatConcatenatedFields";

export const TestCollection: CollectionConfig = {
  slug: 'test-collection',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },

    {
        name:'fullName',
        type: 'text',
        virtual: 'user.firstName',
        
    },
    {
        type: 'row',
        fields: [
            {
                name: 'firstName',
                label: 'First Name',
                type: 'text',
                admin: {
                    width: '50%',
                },
            },
            {
                name: 'lastName',
                label: 'Last Name',
                type: 'text',
                admin: {
                    width: '50%',
                },
            },
        ],
    },
{
        name: 'name',
        label: 'Name',
        type: 'text',
        virtual: true,
        admin: {
            hidden: true,
        },
        hooks: {
            afterRead: [formatConcatenatedFields(['firstName', 'lastName'])],
        },
    },
  ],
}