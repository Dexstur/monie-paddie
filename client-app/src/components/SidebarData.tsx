import { AiOutlineHome } from 'react-icons/ai';
import { BsFillGearFill, BsStack } from 'react-icons/bs';

export const SidebarData = [
    {
        title: 'Home',
        path: '/sidebar/home',
        icon: <AiOutlineHome/>,
        cName: 'nav-text'
    },
    {
        title: 'Payment',
        path: '/sidebar/payment',
        icon: <BsStack/>,
        cName: 'nav-text'
    },
    {
        title: 'Settings',
        path: '/sidebar/settings',
        icon: <BsFillGearFill/>,
        cName: 'nav-text'
    },
]