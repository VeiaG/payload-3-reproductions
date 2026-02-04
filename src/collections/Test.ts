import { CollectionConfig } from "payload";

export const Test:CollectionConfig = {
    slug: 'test',
    fields:[
        {
            name:'content',
            type:'blocks',
            blocks:['content','column']
        }
    ]
}