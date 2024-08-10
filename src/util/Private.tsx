import { useMemo } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

interface ICheck {
    screen: any;
}

const CheckLogin = ({ screen }: ICheck) => {
    
    const privatesUrl = ['mercado-livre-integration', 'admins'];

    const adminId = localStorage.getItem('adminId');
    const url = window.location.href;
    const isPrivateUrl = privatesUrl.some(privateUrl => url.includes(privateUrl));

    if(adminId !== process.env.REACT_APP_ADMIN_ID && isPrivateUrl){
        window.location.href = '/';
    }

    if(adminId){
        return screen;
    } else {
        window.location.href = '/';
    }
};

export default CheckLogin;
