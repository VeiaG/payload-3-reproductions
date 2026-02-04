import { Block } from "payload";

export const Content:Block = {
    slug: 'content',
    interfaceName: 'ContentBlock',
    fields: [
        {
            name: 'content',
            type:'text',
        },

    ],
}