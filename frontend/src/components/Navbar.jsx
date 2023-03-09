import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from './github.svg'

function NavbarBasic() {
  return (
    <>
    <Navbar expand="lg" bg="light" variant="light">
      <Container fluid className='mx-5'>
      <Navbar.Brand href="/">
          Go-bin
        </Navbar.Brand>
        <a href="https://github.com/JayTheBee/go-bin">
        <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="justify-content-end align-top"
          />
        </a>

      </Container>



    </Navbar>
    </>

  );
}

export default NavbarBasic;