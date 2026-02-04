import { Block, Field } from "payload";


const rowField = (fields:Field[]):Field=>({
    name: 'rows',
    type:'array',
    fields:[
        ...fields
    ]
})
export const ColumnBlock:Block = {
    slug: 'column',
    interfaceName: 'ColumnBlock',
    fields: [
    rowField([
        {
            name: 'contentBlocks',
            type:'blocks',
            // blocks:['content']
            blocks:[],
            blockReferences:['content']
        },
    ])
    ],
}

export const ColumnWithoutArrayBlock:Block = {
    slug: 'columnWithoutArray',
    interfaceName: 'ColumnWithoutArrayBlock',
    fields: [
        {
            name: 'contentBlocks',
            type:'blocks',
            // blocks:['content']
            blocks:[],
            blockReferences:['content']
        },
    ],
}

export const ColumnWithoutBlocksBlock:Block = {
    slug: 'columnWithoutBlocks',
    interfaceName: 'ColumnWithoutBlocksBlock',
    fields: [
    rowField([
        {
            name: 'text',
            type:'text',
        },
    ])
    ],
}