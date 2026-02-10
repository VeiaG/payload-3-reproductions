import { CollectionConfig } from "payload";

export const Articles:CollectionConfig = {
    slug:"articles",
    admin:{
        useAsTitle:"title"
    },
    fields:[
        {
            name:"title",
            type:"text",
            required:true
        },
        {
            name:"content",
            type:"richText",
             required:true
        },
        {
            name:'tooltip',
            type:'ui',
            admin:{
                components:{
                    Field:{
                        path:'@/components/index.tsx',
                    }
                }
            }
        },
        {
            name:'slug',
            type:'text',
            admin:{
                position:'sidebar',
            }
        },
    ]
}