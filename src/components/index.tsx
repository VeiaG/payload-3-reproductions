'use client'
import { Tooltip } from '@payloadcms/ui'
import { useState } from 'react'
const TooltipOverflowTest = ()=>{
    const [showTooltip, setShowTooltip] = useState(false);
    const [longerShowTooltip, setLongerShowTooltip] = useState(false);

    return (
        <div>
            Tooltip Overflow Test 
            <div  style={{
                width:'200px',
                height:'50px',
                backgroundColor:'var(--theme-elevation-100)',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                cursor:'pointer',
                position:'relative',
            }}
            
            onMouseEnter={()=>setShowTooltip(true)}
            onMouseLeave={()=>setShowTooltip(false)}
            >
                  <Tooltip show={showTooltip} >
            This is example of very looooooooooooooooooong text looooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooong
        </Tooltip>   
                {
                    showTooltip ? 'Hovering' : 'Hover me'
                }
            </div>
            Longer tooltip to get full-screen width
            <div  style={{
                width:'200px',
                height:'50px',
                backgroundColor:'var(--theme-elevation-100)',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                cursor:'pointer',
                position:'relative',
            }}
            
            onMouseEnter={()=>setLongerShowTooltip(true)}
            onMouseLeave={()=>setLongerShowTooltip(false)}
            >
                  <Tooltip show={longerShowTooltip} >
            This is example of very looooooooooooooooooong text looooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooonglooooooooooooooooooong
        </Tooltip>   
                {
                    longerShowTooltip ? 'Hovering' : 'Hover me'
                }
            </div>
            
          
        </div>
    )
}

export default TooltipOverflowTest