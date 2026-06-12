import { Card } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'

import React from 'react'

import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

function Product({ product }) {
    let history = useHistory()
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!userInfo) {
            history.push('/login')
            return
        }
        fetch(`/api/wishlist/${product.id}/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }).then(async res => {
            const data = await res.json()
            if (res.status === 401) {
                toast.error("Sessiya eskirgan yoki noto'g'ri. Iltimos qaytadan kiring.")
                localStorage.removeItem('userInfo')
                history.push('/login')
                window.location.reload()
            } else if (!res.ok) {
                toast.error(data.detail || "Xatolik yuz berdi")
            } else {
                toast.success(data.detail || "Amal bajarildi")
            }
        }).catch(err => {
            toast.error("Xatolik yuz berdi")
        })
    }
    return (
        <div className="h-100">
            <Card className="h-100">
                <div className="card-img-wrapper">
                    {!(userInfo && userInfo.admin) && (
                        <div className="heart-icon" onClick={toggleWishlist} style={{cursor: 'pointer', zIndex: 10}}>
                            <i className="fas fa-heart"></i>
                        </div>
                    )}
                    <Link to={`/product/${product.id}`} className="text-decoration-none">
                        <Card.Img variant="top" src={product.image} className="card-img-top" />
                    </Link>
                </div>
                <Card.Body>
                    <Link to={`/product/${product.id}`} className="text-decoration-none text-dark flex-grow-1 d-flex flex-column">
                        <Card.Title className="card-title">
                            {product.name}
                        </Card.Title>
                    </Link>
                    
                    <div className="rating-text">
                        <i className="fas fa-star text-warning"></i> 
                        {product.rating} ({product.numReviews} sharhlar)
                    </div>

                    <div className="monthly-price">
                        {Math.round(product.price / 12).toLocaleString()} so'm/oyiga
                    </div>

                    {product.old_price && (
                        <span className="old-price">
                            {parseInt(product.old_price).toLocaleString()} so'm
                        </span>
                    )}
                    <Card.Text as="div" className="price">
                        {parseInt(product.price).toLocaleString()} so'm
                    </Card.Text>

                    {userInfo && userInfo.admin ? (
                        <button className="btn-add-cart mt-2" style={{backgroundColor: '#343a40', borderColor: '#343a40'}} onClick={() => history.push(`/product-update/${product.id}/`)}>
                            <i className="fas fa-edit"></i> O'zgartirish
                        </button>
                    ) : (
                        <button className="btn-add-cart mt-2" onClick={() => history.push(`/product/${product.id}/checkout/`)}>
                            <i className="fas fa-shopping-cart"></i> Savatga
                        </button>
                    )}
                </Card.Body>
            </Card>
        </div>
    )
}

export default Product
