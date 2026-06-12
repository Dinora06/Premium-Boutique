import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, Table, Button, Form, Row, Col, Badge } from 'react-bootstrap'
import axios from 'axios'

function AdminUsersListPage() {
    let history = useHistory()

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    useEffect(() => {
        if (!userInfo || !userInfo.admin) {
            history.push("/login")
        } else {
            fetchUsers()
        }
    }, [userInfo, history])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            }
            const { data } = await axios.get('/account/admin/users/', config)
            setUsers(data)
            setLoading(false)
        } catch (error) {
            setError(error.response && error.response.data.detail ? error.response.data.detail : error.message)
            setLoading(false)
        }
    }

    const deleteUserHandler = async (id) => {
        if (window.confirm("Bu foydalanuvchini o'chirib yuborishga ishonchingiz komilmi?")) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                }
                await axios.delete(`/account/admin/users/${id}/delete/`, config)
                fetchUsers()
            } catch (error) {
                alert(error.response && error.response.data.detail ? error.response.data.detail : error.message)
            }
        }
    }

    const toggleAdminStatus = async (id, currentStatus) => {
        if (window.confirm(`Foydalanuvchining admin holatini o'zgartirishni xohlaysizmi?`)) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                }
                await axios.put(`/account/admin/users/${id}/update/`, { is_admin: !currentStatus }, config)
                fetchUsers()
            } catch (error) {
                alert(error.response && error.response.data.detail ? error.response.data.detail : error.message)
            }
        }
    }

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <Container className="py-5">
            <Row className="align-items-center mb-4">
                <Col md={8}>
                    <h2 className="font-weight-bold" style={{ color: 'var(--primary)' }}>
                        <i className="fas fa-users mr-3"></i> 
                        Foydalanuvchilarni Boshqarish
                    </h2>
                    <p className="text-muted">Tizimdagi barcha mijozlar va adminlarni shu yerdan boshqaring.</p>
                </Col>
                <Col md={4} className="text-right">
                    <Button variant="outline-primary" onClick={() => history.push('/admin-dashboard')}>
                        <i className="fas fa-arrow-left mr-2"></i> Orqaga
                    </Button>
                </Col>
            </Row>

            <div className="bg-white p-4 rounded" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                <Row className="mb-4">
                    <Col md={6}>
                        <Form.Control 
                            type="text" 
                            placeholder="Ism yoki elektron pochta orqali qidiring..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="py-4"
                            style={{ borderRadius: '10px', backgroundColor: '#F8F9FA', border: 'none' }}
                        />
                    </Col>
                </Row>
                
                {loading ? <h4>Yuklanmoqda...</h4> : error ? <h4 className="text-danger">{error}</h4> : (
                    <Table responsive hover className="mt-3 align-middle" style={{ verticalAlign: 'middle' }}>
                        <thead className="text-muted" style={{ backgroundColor: '#F8F9FA' }}>
                            <tr>
                                <th className="py-3 border-0 rounded-left">ID</th>
                                <th className="py-3 border-0">ISM</th>
                                <th className="py-3 border-0">EMAIL</th>
                                <th className="py-3 border-0 text-center">ROLI</th>
                                <th className="py-3 border-0 text-center rounded-right">AMALLAR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td className="py-3 text-muted">#{user.id}</td>
                                    <td className="py-3 font-weight-bold">{user.username}</td>
                                    <td className="py-3">{user.email}</td>
                                    <td className="py-3 text-center">
                                        {user.admin ? (
                                            <Badge pill variant="success" className="px-3 py-2">
                                                <i className="fas fa-user-shield mr-1"></i> Admin
                                            </Badge>
                                        ) : (
                                            <Badge pill variant="secondary" className="px-3 py-2">
                                                Mijoz
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="py-3 text-center">
                                        <Button 
                                            variant={user.admin ? "outline-warning" : "outline-success"} 
                                            size="sm" 
                                            className="mr-2"
                                            style={{ borderRadius: '8px' }}
                                            onClick={() => toggleAdminStatus(user.id, user.admin)}
                                            disabled={user.id === userInfo.id}
                                        >
                                            {user.admin ? <i className="fas fa-level-down-alt"></i> : <i className="fas fa-level-up-alt"></i>}
                                        </Button>
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm" 
                                            style={{ borderRadius: '8px' }}
                                            onClick={() => deleteUserHandler(user.id)}
                                            disabled={user.id === userInfo.id}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        Foydalanuvchilar topilmadi.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>
        </Container>
    )
}

export default AdminUsersListPage
