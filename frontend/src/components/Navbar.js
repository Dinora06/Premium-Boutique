import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userActions'
import { useHistory, Link } from "react-router-dom";
import SearchBarForProducts from './SearchBarForProducts'


function NavBar() {

    let history = useHistory()
    const dispatch = useDispatch()

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // logout
    const logoutHandler = () => {
        dispatch(logout()) // action
        history.push("/login")
        window.location.reload()
    }

    return (
        <header>
            <div className="top-bar d-none d-md-block">
                <Container className="d-flex justify-content-between align-items-center">
                    <div>
                        <span className="mr-3 text-muted" style={{cursor: 'pointer'}}><i className="fas fa-map-marker-alt"></i> Toshkent</span>
                        <Link to="/topshirish-punktlari" className="mr-3 text-muted text-decoration-none">Topshirish punktlari</Link>
                    </div>
                    <div className="d-flex align-items-center">
                        <Link to="/sotuvchi" className="mr-3 text-primary font-weight-bold text-decoration-none">Sotuvchi bo'lish</Link>
                        <Link to="/savol-javob" className="mr-3 text-muted text-decoration-none">Savol-javob</Link>
                        <Link to={userInfo ? "/all-orders/" : "/login"} className="mr-3 text-muted text-decoration-none">{userInfo && userInfo.admin ? "Hamma Buyurtmalar" : "Buyurtmalarim"}</Link>
                        <span className="text-muted" style={{cursor: 'pointer'}}><img src="https://flagcdn.com/16x12/uz.png" alt="UZ" className="mr-1"/> O'zbekcha</span>
                    </div>
                </Container>
            </div>
            <Navbar bg="white" expand="lg" className="sticky-top py-3 border-bottom">
                <Container className="align-items-center">
                    <LinkContainer to="/">
                        <Navbar.Brand>
                            <span style={{ color: 'var(--primary)', fontSize: '1.5rem' }}><i className="fas fa-shopping-bag"></i></span>
                            <span className="ml-2 font-weight-bolder" style={{fontSize: '1.2rem', color: '#333'}}>Premium Mall</span>
                        </Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                        
                        <div className="d-flex align-items-center mx-auto" style={{ width: '60%' }}>
                            <Button variant="primary" className="mr-3 text-nowrap d-none d-md-block" style={{ backgroundColor: '#EBEBFF', color: 'var(--primary)', borderColor: '#EBEBFF' }} onClick={() => history.push('/')}>
                                <i className="fas fa-bars"></i> Katalog
                            </Button>
                            <div className="w-100">
                                <SearchBarForProducts />
                            </div>
                        </div>

                        <Nav className="ml-auto align-items-center">
                            {userInfo && userInfo.admin ?
                                <LinkContainer to="/admin-dashboard">
                                    <Nav.Link className="d-flex flex-column align-items-center px-3">
                                        <i className="fas fa-chart-line mb-1"></i>
                                        <span style={{fontSize: '12px'}}>Admin</span>
                                    </Nav.Link>
                                </LinkContainer>
                                : ""
                            }

                            {userInfo ?
                                <NavDropdown 
                                    title={<div className="d-flex flex-column align-items-center"><i className="fas fa-user mb-1"></i><span style={{fontSize: '12px'}}>{userInfo.username}</span></div>} 
                                    id='username' 
                                    className="px-2 text-center"
                                >
                                    <LinkContainer to="/account">
                                        <NavDropdown.Item>Account Settings</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/all-addresses/">
                                        <NavDropdown.Item>Address Settings</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/stripe-card-details/">
                                        <NavDropdown.Item>Card Settings</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/all-orders/">
                                        <NavDropdown.Item>All Orders</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                                :
                                <LinkContainer to="/login">
                                    <Nav.Link className="d-flex flex-column align-items-center px-3">
                                        <i className="fas fa-user mb-1"></i>
                                        <span style={{fontSize: '12px'}}>Kirish</span>
                                    </Nav.Link>
                                </LinkContainer>
                            }

                            {!(userInfo && userInfo.admin) && (
                                <Nav.Link className="d-flex flex-column align-items-center px-3" onClick={() => history.push('/wishlist')}>
                                    <i className="fas fa-heart mb-1"></i>
                                    <span style={{fontSize: '12px'}}>Saralangan</span>
                                </Nav.Link>
                            )}

                            <Nav.Link className="d-flex flex-column align-items-center px-3" onClick={() => {
                                if(userInfo) {
                                    history.push('/all-orders/')
                                } else {
                                    history.push('/login')
                                }
                            }}>
                                {userInfo && userInfo.admin ? (
                                    <>
                                        <i className="fas fa-boxes mb-1"></i>
                                        <span style={{fontSize: '12px'}}>Hamma Buyurtmalar</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-shopping-cart mb-1"></i>
                                        <span style={{fontSize: '12px'}}>Savat</span>
                                    </>
                                )}
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default NavBar
