import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkTokenValidation, getAllOrders, logout } from '../actions/userActions'
import { useHistory } from 'react-router-dom'
import { Table, Spinner, Card, Badge, Container, Row, Col, Form, InputGroup } from 'react-bootstrap'
import { dateCheck } from '../components/GetDate'
import { changeDeliveryStatus } from '../actions/productActions'
import { CHANGE_DELIVERY_STATUS_RESET } from '../constants'
import Message from '../components/Message'
import { toast } from 'react-toastify'

function OrdersListPage() {
    let history = useHistory()
    const dispatch = useDispatch()
    
    const todays_date = dateCheck(new Date().toISOString().slice(0, 10))
    const [currentDateInfo] = useState(todays_date)
    const [idOfchangeDeliveryStatus, setIdOfchangeDeliveryStatus] = useState(0)
    const [cloneSearchTerm, setCloneSearchTerm] = useState("")

    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    const getAllOrdersReducer = useSelector(state => state.getAllOrdersReducer)
    const { orders, loading: loadingOrders } = getAllOrdersReducer

    const changeDeliveryStatusReducer = useSelector(state => state.changeDeliveryStatusReducer)
    const { success: deliveryStatusChangeSuccess, loading: deliveryStatusChangeSpinner } = changeDeliveryStatusReducer

    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            dispatch(checkTokenValidation())
            dispatch(getAllOrders())
        }
    }, [userInfo, dispatch, history])

    if (userInfo && tokenError === "Request failed with status code 401") {
        toast.info("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    const changeDeliveryStatusHandler = (id, status) => {
        setIdOfchangeDeliveryStatus(id)
        const productData = {
            "is_delivered": status,
            "delivered_at": status ? currentDateInfo : "Not Delivered"
        }
        dispatch(changeDeliveryStatus(id, productData))
    }

    if (deliveryStatusChangeSuccess) {
        toast.info("Delivery status changed successfully")
        dispatch({ type: CHANGE_DELIVERY_STATUS_RESET })
        dispatch(getAllOrders())
    }

    const handleSearch = (e) => {
        setCloneSearchTerm(e.target.value.toLowerCase())
    }

    const filteredOrders = orders ? orders.filter((item) => (
        (item.name && item.name.toLowerCase().includes(cloneSearchTerm)) ||
        (item.ordered_item && item.ordered_item.toLowerCase().includes(cloneSearchTerm)) ||
        (item.address && item.address.toLowerCase().includes(cloneSearchTerm))
    )) : []

    const formatPrice = (price) => {
        return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS' }).format(price || 0)
    }

    return (
        <Container className="py-4">
            <h2 className="mb-4 text-primary font-weight-bold" style={{ fontSize: '1.8rem', borderBottom: '2px solid #EBEBFF', paddingBottom: '10px' }}>
                <i className="fas fa-box-open mr-2"></i> {userInfo && userInfo.admin ? 'All Orders Management' : 'Mening Buyurtmalarim'}
            </h2>

            {userInfo && userInfo.admin && (
                <Card className="mb-4 shadow-sm border-0" style={{ borderRadius: '12px' }}>
                    <Card.Body className="p-3">
                        <InputGroup>
                            <InputGroup.Text className="bg-white border-right-0"><i className="fas fa-search text-muted"></i></InputGroup.Text>
                            <Form.Control 
                                type="text" 
                                placeholder="Search orders by Name, Address or Item..." 
                                className="border-left-0 pl-0"
                                style={{ boxShadow: 'none' }}
                                onChange={handleSearch}
                            />
                        </InputGroup>
                    </Card.Body>
                </Card>
            )}

            {loadingOrders ? (
                <div className="d-flex justify-content-center my-5 py-5">
                    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                </div>
            ) : filteredOrders.length > 0 ? (
                userInfo && userInfo.admin ? (
                    <Card className="shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <Table responsive hover className="mb-0" style={{ backgroundColor: 'white' }}>
                            <thead style={{ backgroundColor: '#f8f9fa' }}>
                                <tr className="text-muted text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                                    <th className="py-3 px-4 border-0">ID</th>
                                    <th className="py-3 px-4 border-0">Customer</th>
                                    <th className="py-3 px-4 border-0">Address</th>
                                    <th className="py-3 px-4 border-0">Item</th>
                                    <th className="py-3 px-4 border-0">Amount</th>
                                    <th className="py-3 px-4 border-0">Status</th>
                                    <th className="py-3 px-4 border-0 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td className="py-3 px-4 align-middle font-weight-bold">#{order.id}</td>
                                        <td className="py-3 px-4 align-middle">
                                            <div className="font-weight-bold text-dark">{order.name}</div>
                                            <small className="text-muted">Card: •••• {order.card_number}</small>
                                        </td>
                                        <td className="py-3 px-4 align-middle text-muted" style={{ maxWidth: '200px' }}>
                                            <div className="text-truncate" title={order.address}>{order.address || 'N/A'}</div>
                                        </td>
                                        <td className="py-3 px-4 align-middle">
                                            <div className="text-primary font-weight-bold">{order.ordered_item}</div>
                                            <small className="text-muted">{dateCheck(order.paid_at)}</small>
                                        </td>
                                        <td className="py-3 px-4 align-middle font-weight-bold text-success">
                                            {formatPrice(order.total_price)}
                                        </td>
                                        <td className="py-3 px-4 align-middle">
                                            <div className="d-flex flex-column gap-1">
                                                {order.paid_status ? 
                                                    <Badge pill variant="success" className="px-2 py-1 mb-1 shadow-sm"><i className="fas fa-check mr-1"></i>Paid</Badge> : 
                                                    <Badge pill variant="danger" className="px-2 py-1 mb-1 shadow-sm"><i className="fas fa-times mr-1"></i>Unpaid</Badge>
                                                }
                                                {order.is_delivered ? 
                                                    <Badge pill variant="primary" className="px-2 py-1 shadow-sm"><i className="fas fa-truck mr-1"></i>Delivered</Badge> : 
                                                    <Badge pill variant="warning" className="px-2 py-1 shadow-sm text-dark"><i className="fas fa-clock mr-1"></i>Pending</Badge>
                                                }
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 align-middle text-center">
                                            {order.is_delivered ? (
                                                <button 
                                                    className="btn btn-outline-danger btn-sm rounded-pill px-3 font-weight-bold" 
                                                    onClick={() => changeDeliveryStatusHandler(order.id, false)}
                                                >
                                                    {deliveryStatusChangeSpinner && idOfchangeDeliveryStatus === order.id ? <Spinner animation="border" size="sm" /> : "Undo"}
                                                </button>
                                            ) : (
                                                <button 
                                                    className="btn btn-primary btn-sm rounded-pill px-3 font-weight-bold shadow-sm" 
                                                    onClick={() => changeDeliveryStatusHandler(order.id, true)}
                                                >
                                                    {deliveryStatusChangeSpinner && idOfchangeDeliveryStatus === order.id ? <Spinner animation="border" size="sm" /> : "Deliver"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                ) : (
                    <Row>
                        {filteredOrders.map((order) => (
                            <Col xs={12} md={6} lg={4} key={order.id} className="mb-4">
                                <Card className="h-100 shadow-sm border-0 order-card" style={{ borderRadius: '16px', transition: 'transform 0.2s', cursor: 'pointer' }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                    <Card.Header className="bg-white border-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
                                        <span className="font-weight-bold text-muted">Buyurtma #{order.id}</span>
                                        <span className="text-muted small">{dateCheck(order.paid_at)}</span>
                                    </Card.Header>
                                    <Card.Body className="px-4 py-3 d-flex flex-column">
                                        <h5 className="font-weight-bold text-dark mb-3" style={{ lineHeight: '1.4' }}>
                                            {order.ordered_item}
                                        </h5>
                                        <div className="d-flex align-items-center mb-4 mt-auto">
                                            <div className="rounded-circle d-flex justify-content-center align-items-center mr-3 shadow-sm" 
                                                style={{ width: '45px', height: '45px', backgroundColor: '#F0E6FF', color: 'var(--primary)' }}>
                                                <i className="fas fa-box-open" style={{ fontSize: '1.2rem' }}></i>
                                            </div>
                                            <div>
                                                <div className="text-muted small font-weight-bold text-uppercase">Jami summa</div>
                                                <div className="font-weight-bold text-success" style={{ fontSize: '1.1rem' }}>{formatPrice(order.total_price)}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded" style={{ borderRadius: '12px' }}>
                                            <div className="d-flex flex-column">
                                                <span className="text-muted small mb-1">To'lov holati</span>
                                                {order.paid_status ? 
                                                    <span className="font-weight-bold text-success"><i className="fas fa-check-circle mr-1"></i> To'langan</span> : 
                                                    <span className="font-weight-bold text-danger"><i className="fas fa-times-circle mr-1"></i> To'lanmagan</span>
                                                }
                                            </div>
                                            <div className="d-flex flex-column text-right">
                                                <span className="text-muted small mb-1">Yetkazib berish</span>
                                                {order.is_delivered ? 
                                                    <span className="font-weight-bold text-primary"><i className="fas fa-truck mr-1"></i> Yetkazildi</span> : 
                                                    <span className="font-weight-bold text-warning"><i className="fas fa-clock mr-1"></i> Kutilmoqda</span>
                                                }
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )
            ) : (
                <div className="text-center my-5 py-5 bg-white shadow-sm rounded" style={{ borderRadius: '16px' }}>
                    <div className="mb-3">
                        <i className="fas fa-box-open text-muted" style={{ fontSize: '4rem', opacity: '0.3' }}></i>
                    </div>
                    <h4 className="text-muted font-weight-bold">Sizda hali buyurtmalar yo'q</h4>
                    <p className="text-muted">Katalogdan o'zingizga yoqqan mahsulotni tanlang va xarid qiling.</p>
                    <button className="btn btn-primary rounded-pill px-4 py-2 mt-2 font-weight-bold shadow" onClick={() => history.push('/')}>
                        Xaridni boshlash
                    </button>
                </div>
            )}
        </Container>
    )
}

export default OrdersListPage