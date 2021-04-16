import { Image,Col,Row,Container} from 'react-bootstrap';
import { Button,Grid,Box  } from 'grommet';


import logo from './Logo_CDP.png';
import fondo from './Fondo.png';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
function Login() {
   
  
    return (
<>
        <Grid
            rows={['xxsmall', 'xsmall']}
            columns={['xsmall', 'small']}
            gap="small"
            areas={[
                { name: 'header', start: [0, 0], end: [1, 0] },
            
            ]}
        >
  <Box gridArea="header" background="brand" />

</Grid>

        <Container>
        
        <Row>
            <Col >
                <Image src={logo}  />
            </Col>
            <Col>
                <Button primary label="Iniciar sesión" color={"#f4971a"} />
            </Col>

        </Row>
        <Image src={fondo}  />
    </Container>
    <Container>
        
    </Container>
    </>
    );
  }
  
  export default Login;