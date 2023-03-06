import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from './logo.svg'

function NavbarBasic() {
  return (
    <>
    <Navbar expand="lg" bg="light" variant="light">
      <Container fluid className='mx-5'>
      <Navbar.Brand href="#home">
          <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          Go-bin
        </Navbar.Brand>
        <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="justify-content-end align-top"
          />
      </Container>



    </Navbar>
    </>

  );
}

export default NavbarBasic;