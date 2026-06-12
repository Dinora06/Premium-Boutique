import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Message from '../components/Message'

function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState([])
    const [loading, setLoading] = useState(true)
    
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer
    let history = useHistory()

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
            return
        }
        fetchWishlist()
    }, [userInfo, history])

    const fetchWishlist = () => {
        fetch('/api/wishlist/', {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setWishlistItems(data)
            setLoading(false)
        })
        .catch(err => {
            console.error(err)
            setLoading(false)
        })
    }

    const removeFromWishlist = (productId) => {
        fetch(`/api/wishlist/${productId}/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }).then(() => fetchWishlist())
    }

    return (
        <Container className="mt-4">
            <h2>Saralangan mahsulotlar</h2>
            {loading ? <p>Yuklanmoqda...</p> : 
                wishlistItems.length === 0 ? <Message>Sevimlilar ro'yxati bo'sh</Message> :
                <Row>
                    {wishlistItems.map(item => (
                        <Col key={item.id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                            <Card className="p-3 rounded h-100 shadow-sm border-0">
                                <Link to={`/product/${item.product.id}`}>
                                    <Card.Img src={item.product.image} variant='top' style={{height: '200px', objectFit: 'contain', backgroundColor: '#f8f9fa'}} />
                                </Link>
                                <Card.Body className="d-flex flex-column px-0">
                                    <Link to={`/product/${item.product.id}`} className="text-decoration-none text-dark">
                                        <Card.Title as="div" className="mb-1" style={{fontSize: '1rem', fontWeight: '500', height: '48px', overflow: 'hidden'}}>
                                            {item.product.name}
                                        </Card.Title>
                                    </Link>
                                    <Card.Text as="h5" className="mb-3 font-weight-bold" style={{color: 'var(--text-dark)'}}>
                                        {parseInt(item.product.price).toLocaleString()} so'm
                                    </Card.Text>
                                    <Button variant="danger" className="mt-auto btn-sm" onClick={() => removeFromWishlist(item.product.id)}>
                                        <i className="fas fa-trash"></i> O'chirish
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            }
        </Container>
    )
}

export default WishlistPage
