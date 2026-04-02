import type { CollectionConfig } from 'payload'
import { formatConcatenatedFields } from './formatConcatenatedFields'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
  },
  auth: true,
  forceSelect: {
		firstName: true,
		lastName: true,
	},
  fields: [
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
