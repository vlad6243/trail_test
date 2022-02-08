import { Navbar, Container } from 'react-bootstrap'

export default function NavbarComponent() {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>
                    Currency exchange
                </Navbar.Brand>
            </Container>
        </Navbar>
    )
}
