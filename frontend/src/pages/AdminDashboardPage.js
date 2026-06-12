import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, Row, Col, Table, Button } from 'react-bootstrap'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from 'axios'

function AdminDashboardPage() {
    let history = useHistory()
    const dispatch = useDispatch()

    const [dashboardData, setDashboardData] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    useEffect(() => {
        if (!userInfo || !userInfo.admin) {
            history.push("/login")
        } else {
            fetchDashboardData()
        }
    }, [userInfo, history])

    const fetchDashboardData = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            }
            const { data } = await axios.get('/account/admin-dashboard/', config)
            setDashboardData(data)
            setLoading(false)
        } catch (error) {
            setError(error.response && error.response.data.detail ? error.response.data.detail : error.message)
            setLoading(false)
        }
    }

    // Prepare mock chart data from recent orders for demonstration
    // In production, backend should send aggregated monthly/daily sales
    const prepareChartData = () => {
        if (!dashboardData.recent_orders) return []
        // Just reversing so older is first
        const orders = [...dashboardData.recent_orders].reverse()
        return orders.map(order => ({
            name: order.paid_at ? order.paid_at.substring(5, 10) : 'N/A',
            savdo: parseInt(order.total_price),
            id: order.id
        }))
    }

    const chartData = prepareChartData()

    return (
        <Container className="py-5">
            <h1 className="mb-2 font-weight-bold">Boshqaruv Paneli</h1>
            <p className="text-muted mb-5">Ulgurji savdo do'koni tizim tahlillari</p>

            {loading ? <h3>Yuklanmoqda...</h3> : error ? <h3 className="text-danger">{error}</h3> : (
                <>
                    <Row className="mb-5">
                        <Col md={3}>
                            <div className="dashboard-card bg-revenue">
                                <h6>Umumiy Daromad</h6>
                                <h2 className="mb-0">{dashboardData.total_revenue?.toLocaleString()} <small>so'm</small></h2>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="dashboard-card bg-orders">
                                <h6>Jami Buyurtmalar</h6>
                                <h2 className="mb-0">{dashboardData.total_orders} <small>ta</small></h2>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="dashboard-card bg-users">
                                <h6>Foydalanuvchilar</h6>
                                <h2 className="mb-0">{dashboardData.total_users} <small>ta</small></h2>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="dashboard-card bg-products">
                                <h6>Jami Mahsulotlar</h6>
                                <h2 className="mb-0">{dashboardData.total_products} <small>xil</small></h2>
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-5">
                        <Col md={12}>
                            <h3 className="mb-4">Savdo Dinamikasi (So'nggi buyurtmalar)</h3>
                            <div style={{ width: '100%', height: 350, backgroundColor: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={chartData}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
                                        <Legend />
                                        <Line type="monotone" dataKey="savdo" name="Daromad (so'm)" stroke="#3B82F6" strokeWidth={4} dot={{ r: 6, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={8}>
                            <h3 className="mb-4">So'nggi Buyurtmalar</h3>
                            <Table responsive hover className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Mijoz</th>
                                        <th>Sana</th>
                                        <th>Summa</th>
                                        <th>To'lov</th>
                                        <th>Yetkazib berish</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboardData.recent_orders && dashboardData.recent_orders.map(order => (
                                        <tr key={order.id}>
                                            <td className="font-weight-bold">#{order.id}</td>
                                            <td>{order.name}</td>
                                            <td>{order.paid_at ? order.paid_at.substring(0, 10) : 'N/A'}</td>
                                            <td className="font-weight-bold">{parseInt(order.total_price).toLocaleString()} so'm</td>
                                            <td>
                                                {order.paid_status ? (
                                                    <span className="badge badge-success px-3 py-2 rounded-pill">To'langan</span>
                                                ) : (
                                                    <span className="badge badge-danger px-3 py-2 rounded-pill">To'lanmagan</span>
                                                )}
                                            </td>
                                            <td>
                                                {order.is_delivered ? (
                                                    <span className="badge badge-info px-3 py-2 rounded-pill">Yetkazilgan</span>
                                                ) : (
                                                    <span className="badge badge-warning px-3 py-2 rounded-pill text-white">Jarayonda</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                        <Col md={4}>
                            <h3 className="mb-4">Tezkor Amallar</h3>
                            <div className="bg-white p-4 rounded" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                                <Button variant="dark" className="w-100 mb-3 py-3" onClick={() => history.push('/new-product/')}>
                                    <i className="fas fa-plus mr-2"></i> Yangi Mahsulot Qo'shish
                                </Button>
                                <Button variant="outline-dark" className="w-100 mb-3 py-3" onClick={() => history.push('/')}>
                                    <i className="fas fa-box-open mr-2"></i> Mahsulotlarni Boshqarish
                                </Button>
                                <Button variant="outline-primary" className="w-100 py-3" onClick={() => history.push('/admin-users/')}>
                                    <i className="fas fa-users mr-2"></i> Foydalanuvchilarni Boshqarish
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    )
}

export default AdminDashboardPage
