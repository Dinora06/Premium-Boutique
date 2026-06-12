import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProduct, getProductDetails } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col, Container, Card, Button, Modal, Carousel, ListGroup, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { CREATE_PRODUCT_RESET, DELETE_PRODUCT_RESET, UPDATE_PRODUCT_RESET, CARD_CREATE_RESET } from '../constants'
import { toast } from 'react-toastify'


function ProductDetailsPage({ history, match }) {

    const dispatch = useDispatch()

    // modal state and functions
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // product details reducer
    const productDetailsReducer = useSelector(state => state.productDetailsReducer)
    const { loading, error, product } = productDetailsReducer

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // product details reducer
    const deleteProductReducer = useSelector(state => state.deleteProductReducer)
    const { success: productDeletionSuccess } = deleteProductReducer

    useEffect(() => {
        dispatch(getProductDetails(match.params.id))
        dispatch({
            type: UPDATE_PRODUCT_RESET
        })
        dispatch({
            type: CREATE_PRODUCT_RESET
        })
        dispatch({
            type: CARD_CREATE_RESET
        })
    }, [dispatch, match])

    // product delete confirmation
    const confirmDelete = () => {
        dispatch(deleteProduct(match.params.id))
        handleClose()
    }

    // after product deletion
    if (productDeletionSuccess) {
        toast.info("Product successfully deleted.")
        history.push("/")
        dispatch({
            type: DELETE_PRODUCT_RESET
        })
    }

    return (
        <div>

            {/* Modal Start*/}
            <div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <i style={{ color: "#e6e600" }} className="fas fa-exclamation-triangle"></i>
                            {" "}
                            Delete Confirmation
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this product <em>"{product.name}"</em>?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => confirmDelete()}>
                            Confirm Delete
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            {/* Modal End */}

            {loading && <span style={{ display: "flex" }}>
                <h5>Getting Product Details</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span>}
            {error ? <Message variant='danger'>{error}</Message>
                :
                <div>
                    <Container>
                        <div className="mb-4">
                            <h2 className="mb-2 font-weight-bold" style={{fontSize: '1.8rem', color: '#333'}}>{product.name}</h2>
                            <div className="d-flex align-items-center mb-3">
                                <div className="text-warning mr-2" style={{fontSize: '1.1rem'}}>
                                    {[...Array(5)].map((star, i) => (
                                        <i key={i} className={i < product.rating ? "fas fa-star" : "far fa-star"}></i>
                                    ))}
                                </div>
                                <span className="text-muted mr-3">
                                    {product.reviews && product.reviews.length === 0 ? "Sharhlar yo'q" : `${product.numReviews} sharhlar`}
                                </span>
                                <span className="text-muted mr-3">•</span>
                                <span className="text-muted">{product.numReviews * 5 + 12} buyurtma</span>
                            </div>
                        </div>

                        <Row>
                            <Col md={8}>
                                {product.images && product.images.length > 0 ? (
                                    <Carousel pause="hover" className="bg-white mb-4" indicators={false}>
                                        <Carousel.Item>
                                            <img src={product.image} alt={product.name} className="d-block w-100 rounded" style={{height: '550px', objectFit: 'contain', backgroundColor: '#f4f4f4'}} />
                                        </Carousel.Item>
                                        {product.images.map(img => (
                                            <Carousel.Item key={img.id}>
                                                <img src={img.image} alt={product.name} className="d-block w-100 rounded" style={{height: '550px', objectFit: 'contain', backgroundColor: '#f4f4f4'}} />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                ) : (
                                    <img src={product.image} alt={product.name} className="d-block w-100 rounded mb-4" style={{height: '550px', objectFit: 'contain', backgroundColor: '#f4f4f4'}} />
                                )}

                                {userInfo && userInfo.admin ?
                                    <div className="d-flex mb-4">
                                        <button
                                            className="btn btn-danger btn-sm button-focus-css mr-2 w-50"
                                            onClick={() => handleShow()}
                                        >Delete Product
                                        </button>

                                        <button
                                            className="btn btn-primary btn-sm button-focus-css w-50"
                                            onClick={() => history.push(`/product-update/${product.id}/`)}
                                        >Edit Product
                                        </button>
                                    </div>
                                    : ""}

                                <div className="mt-5 mb-5">
                                    <div className="d-flex mb-4 border-bottom">
                                        <h5 className="font-weight-bold pb-2 border-bottom border-dark" style={{marginBottom: '-1px', cursor: 'pointer', marginRight: '30px'}}>Mahsulot tavsifi</h5>
                                        <h5 className="text-muted pb-2" style={{cursor: 'pointer'}}>O'lchamlar</h5>
                                    </div>
                                    
                                    <Row className="mb-5">
                                        <Col md={6}>
                                            <ul className="list-unstyled text-muted" style={{lineHeight: '2.5', fontSize: '1rem'}}>
                                                {product.brand && <li>• Brend: <b className="text-dark">{product.brand}</b></li>}
                                                {product.color && <li>• Rang: <b className="text-dark">{product.color}</b></li>}
                                                {product.size && <li>• O'lcham: <b className="text-dark">{product.size}</b></li>}
                                                {product.material && <li>• Material: <b className="text-dark">{product.material}</b></li>}
                                            </ul>
                                        </Col>
                                        <Col md={6}>
                                            <ul className="list-unstyled text-muted" style={{lineHeight: '2.5', fontSize: '1rem'}}>
                                                {product.season && <li>• Mavsum: <b className="text-dark">{product.season}</b></li>}
                                                {product.country_of_origin && <li>• Ishlab chiqaruvchi davlat: <b className="text-dark">{product.country_of_origin}</b></li>}
                                                <li>• Eng kam buyurtma: <b className="text-dark">{product.min_order_quantity} dona</b></li>
                                            </ul>
                                        </Col>
                                    </Row>
                                    
                                    <div className="mt-2">
                                        <h5 className="font-weight-bold mb-3">Batafsil ma'lumot</h5>
                                        <p className="text-dark" style={{whiteSpace: 'pre-line', fontSize: '1.05rem', lineHeight: '1.8'}}>{product.description}</p>
                                    </div>
                                </div>
                            </Col>

                            <Col md={4}>
                                <div className="p-4 border rounded shadow-sm sticky-top" style={{top: '90px', backgroundColor: 'white'}}>
                                    <div className="font-weight-bold mb-1" style={{fontSize: '2.2rem', color: '#7000FF'}}>
                                        {parseInt(product.price).toLocaleString()} so'm
                                    </div>
                                    {product.old_price && (
                                        <div className="text-muted mb-4" style={{fontSize: '1rem'}}>
                                            Uzum kartasiz oddiy narx: <span style={{textDecoration: 'line-through'}}>{parseInt(product.old_price).toLocaleString()} so'm</span>
                                        </div>
                                    )}
                                    
                                    <div className="p-3 mb-4 rounded d-flex align-items-center" style={{backgroundColor: '#F3E5F5', color: '#7000FF', fontWeight: 'bold', fontSize: '0.9rem'}}>
                                        <div style={{backgroundColor: 'yellow', color: 'black', padding: '4px 8px', borderRadius: '4px', marginRight: '10px'}}>
                                            {Math.round(product.price / 12).toLocaleString()} so'm
                                        </div> 
                                        <span>x 12 oy</span>
                                        <i className="fas fa-chevron-right ml-auto text-muted"></i>
                                    </div>

                                    {product.stock ?
                                        userInfo && userInfo.admin ? (
                                            <div className="p-3 bg-light rounded text-center text-muted font-weight-bold mb-3">
                                                <i className="fas fa-info-circle mr-2"></i> Adminlar xarid qila olmaydi
                                            </div>
                                        ) : (
                                            <div>
                                                <button className="btn w-100 mb-3 py-3 font-weight-bold" style={{backgroundColor: '#F0F0F0', color: '#333', borderRadius: '12px'}} onClick={() => history.push(`/product/${product.id}/checkout/`)}>
                                                    1 klikda xarid qilish
                                                </button>
                                                
                                                <button className="btn w-100 py-3 font-weight-bold d-flex align-items-center justify-content-center" style={{backgroundColor: '#7000FF', color: 'white', borderRadius: '12px'}} onClick={() => history.push(`/product/${product.id}/checkout/`)}>
                                                    <i className="fas fa-shopping-bag mr-2"></i> Savatga qo'shish
                                                </button>
                                            </div>
                                        )
                                        :
                                        <Message variant='danger'>
                                            Sotuvda qolmagan
                                        </Message>}
                                        
                                    <div className="mt-4">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="fas fa-check text-success mr-2"></i>
                                            <span className="text-muted" style={{fontSize: '0.9rem'}}>Oxirgisi qoldi!</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-fire text-danger mr-2"></i>
                                            <span className="text-muted" style={{fontSize: '0.9rem'}}>Bu haftada 2 kishi sotib oldi</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-3 rounded border" style={{backgroundColor: '#FAFAFA'}}>
                                        <div className="font-weight-bold mb-1" style={{color: '#333'}}>Ertaga yetkazib beramiz</div>
                                        <div className="text-muted" style={{fontSize: '0.85rem'}}>Topshirish punktiga yoki kuryer orqali</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row className="mt-5">
                            <Col md={6}>
                                <h4>Sharhlar</h4>
                                {product.reviews && product.reviews.length === 0 && <Message>Sharhlar yo'q</Message>}
                                <ListGroup variant='flush'>
                                    {product.reviews && product.reviews.map(review => (
                                        <ListGroup.Item key={review.id}>
                                            <strong>{review.name}</strong>
                                            <div className="text-warning">
                                                {[...Array(5)].map((star, i) => (
                                                    <i key={i} className={i < review.rating ? "fas fa-star" : "far fa-star"}></i>
                                                ))}
                                            </div>
                                            <p>{review.createdAt.substring(0, 10)}</p>
                                            <p>{review.comment}</p>
                                        </ListGroup.Item>
                                    ))}
                                    <ListGroup.Item>
                                        <h4>Sharh yozish</h4>
                                        {userInfo ? (
                                            <Form onSubmit={(e) => {
                                                e.preventDefault();
                                                const rating = e.target.rating.value;
                                                const comment = e.target.comment.value;
                                                // Fetch call to submit review
                                                fetch(`/api/product/${product.id}/reviews/`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        Authorization: `Bearer ${userInfo.token}`
                                                    },
                                                    body: JSON.stringify({ rating, comment })
                                                }).then(async res => {
                                                    const data = await res.json();
                                                    if (res.status === 401) {
                                                        toast.error("Sessiya eskirgan yoki noto'g'ri. Iltimos qaytadan kiring.")
                                                        localStorage.removeItem('userInfo')
                                                        window.location.href = '/login'
                                                    } else if (!res.ok) {
                                                        toast.error(data.detail || "Xatolik yuz berdi");
                                                    } else { 
                                                        toast.success('Sharh qoldirildi'); 
                                                        window.location.reload(); 
                                                    }
                                                }).catch(err => {
                                                    toast.error("Xatolik yuz berdi");
                                                });
                                            }}>
                                                <Form.Group controlId='rating'>
                                                    <Form.Label>Baho</Form.Label>
                                                    <Form.Control as='select' name='rating'>
                                                        <option value=''>Tanlash...</option>
                                                        <option value='1'>1 - Yomon</option>
                                                        <option value='2'>2 - Qoniqarsiz</option>
                                                        <option value='3'>3 - Yaxshi</option>
                                                        <option value='4'>4 - Juda yaxshi</option>
                                                        <option value='5'>5 - Ajoyib</option>
                                                    </Form.Control>
                                                </Form.Group>
                                                <Form.Group controlId='comment'>
                                                    <Form.Label>Izoh</Form.Label>
                                                    <Form.Control as='textarea' rows='3' name='comment'></Form.Control>
                                                </Form.Group>
                                                <Button type='submit' variant='primary' className="mt-3">Yuborish</Button>
                                            </Form>
                                        ) : (
                                            <Message>Sharh yozish uchun <Link to='/login'>tizimga kiring</Link></Message>
                                        )}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>

                    </Container>
                </div>
            }
        </div >
    )
}

export default ProductDetailsPage
