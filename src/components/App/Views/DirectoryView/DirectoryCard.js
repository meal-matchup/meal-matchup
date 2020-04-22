import React, { useEffect, useState } from 'react';
import { Card } from 'antd';


function DirectoryCard({name}) {
    return(
        <div>
            <Card title= {name} style={{ width: 500, margin : 20}}>
                <p>Card content</p>
                <p>Card content</p>
            </Card>
        </div>
    )
}

export default DirectoryCard;