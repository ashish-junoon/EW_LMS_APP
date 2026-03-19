import React from 'react';
import * as Ri from 'react-icons/ri'; //Remix Icons 
import * as Md from 'react-icons/md'; //Material Icons
import * as Io from 'react-icons/io5'; //Ion Icons
import * as Gi from 'react-icons/gi';
import * as Pi from 'react-icons/pi';
import * as Go from 'react-icons/go'
import * as Ci from 'react-icons/ci';
import * as Gr from 'react-icons/gr';
import * as Fa from 'react-icons/fa';
import * as Tb from 'react-icons/tb';
import * as Ti from 'react-icons/ti';
import * as Hi from 'react-icons/hi';
// Import other icon sets as needed

const Icon = ({ name, size = 24, color = 'currentColor', style = {} }) => {
    let IconComponent;

    if (name.startsWith('Ri')) {
        IconComponent = Ri[name];
    } else if (name.startsWith('Md')) {
        IconComponent = Md[name];
    } else if (name.startsWith('Io')) {
        IconComponent = Io[name];
    } else if (name.startsWith('Gi')) {
        IconComponent = Gi[name];
    } else if (name.startsWith('Pi')) {
        IconComponent = Pi[name];
    } else if (name.startsWith('Go')) {
        IconComponent = Go[name];
    } else if (name.startsWith('Ci')) {
        IconComponent = Ci[name];
    } else if (name.startsWith('Gr')) {
        IconComponent = Gr[name];
    }else if (name.startsWith('Fa')) {
        IconComponent = Fa[name];
    }else if (name.startsWith('Tb')) {
        IconComponent = Tb[name];
    }else if (name.startsWith('Ti')) {
        IconComponent = Ti[name];
    }else if (name.startsWith('Hi')) {
        IconComponent = Hi[name];
    }
    // Add more conditions for other icon sets

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found`);
        return null;
    }

    return <IconComponent size={size} color={color} style={style} />;
};

export default Icon;