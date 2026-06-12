import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProductsList } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Paginate from '../components/Paginate'
import FilterSidebar from '../components/FilterSidebar'
import { useHistory, useLocation } from "react-router-dom";
import { CREATE_PRODUCT_RESET } from '../constants'


function ProductsListPage() {

    let history = useHistory()
    let location = useLocation()
    const dispatch = useDispatch()

    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('keyword') || ''
    const page = searchParams.get('page') || 1

    const color = searchParams.get('color') || ''
    const size = searchParams.get('size') || ''
    const season = searchParams.get('season') || ''
    const min_price = searchParams.get('min_price') || ''
    const max_price = searchParams.get('max_price') || ''
    const brand = searchParams.get('brand') || ''
    const category = searchParams.get('category') || ''

    // products list reducer
    const productsListReducer = useSelector(state => state.productsListReducer)
    const { loading, error, products, page: currentPage, pages } = productsListReducer

    useEffect(() => {
        dispatch(getProductsList({ keyword, page, color, size, season, min_price, max_price, brand, category }))
        dispatch({
            type: CREATE_PRODUCT_RESET
        })
    }, [dispatch, keyword, page, color, size, season, min_price, max_price, brand, category])

    const showNothingMessage = () => {
        return (
            <div>
                {!loading ? <Message variant='info'>Nothing to show</Message> : ""}                
            </div>
        )
    }

    return (
        <div>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <span style={{ display: "flex" }}>
                <h5>Getting Products</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span>}
            <div>
                <Row>
                    <Col md={3} className="d-none d-md-block">
                        <FilterSidebar />
                    </Col>
                    <Col md={9}>
                        <div className="product-grid">
                            {products.length === 0 ? showNothingMessage() : products.map((product, idx) => (
                                <Product key={product.id} product={product} />
                            ))}
                        </div>
                        <div className="mt-4">
                            <Paginate page={currentPage} pages={pages} keyword={keyword ? `?keyword=${keyword}` : ''} />
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default ProductsListPage
