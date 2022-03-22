
 import { Box ,Image } from '@mantine/core';
import passengerlogo from '../../assets/images/passengerlogo.png';

export default function Header(props) {
    return (
        <Box style={{ display:'flex',marginTop: 10 , justifyContent:'flex-end' }}  >
           <img src={passengerlogo} height={40} className="appLogo" />
        </Box>
    );
  }

