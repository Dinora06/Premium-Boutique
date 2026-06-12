import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import { getProductDetails, updateProduct } from '../actions/productActions'
import { checkTokenValidation, logout } from '../actions/userActions'
import { UPDATE_PRODUCT_RESET } from '../constants'
import Message from '../components/Message'
import { toast } from 'react-toastify'


const ProductUpdatePage = ({ match }) => {

    // product details reducer
    const productDetailsReducer = useSelector(state => state.productDetailsReducer)
    const { loading: loadingPageDetails, product } = productDetailsReducer

    // as our errors will be displayed at the top of the webpage
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [brand, setBrand] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [oldPrice, setOldPrice] = useState("")
    const [stock, setStock] = useState("")
    const [minOrderQuantity, setMinOrderQuantity] = useState("")
    const [color, setColor] = useState("")
    const [size, setSize] = useState("")
    const [season, setSeason] = useState("")
    const [material, setMaterial] = useState("")
    const [countryOfOrigin, setCountryOfOrigin] = useState("")
    const [image, setImage] = useState("")

    let history = useHistory()
    const dispatch = useDispatch()

    const [newImage, setNewImage] = useState(false)

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // product details reducer
    const updateProductReducer = useSelector(state => state.updateProductReducer)
    const {
        success: productUpdationSuccess,
        loading: loadingProductUpdations,
        error: productUpdationError
    } = updateProductReducer

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer
    
    // get product details
    useEffect(() => {
        if (!userInfo || !userInfo.admin) {
            history.push("/login")
        }
        dispatch(checkTokenValidation())
        dispatch(getProductDetails(match.params.id))
    }, [dispatch, userInfo, history, match])

    const onSubmit = (e) => {
        e.preventDefault()
        const productId = product.id
        let form_data = new FormData()
        if(name) form_data.append('name', name)
        if(category) form_data.append('category', category)
        if(brand) form_data.append('brand', brand)
        if(description) form_data.append('description', description)
        if(price) form_data.append('price', price)
        if(oldPrice) form_data.append('old_price', oldPrice)
        if(stock !== "") form_data.append('stock', stock)
        if(minOrderQuantity !== "") form_data.append('min_order_quantity', minOrderQuantity)
        if(color) form_data.append('color', color)
        if(size) form_data.append('size', size)
        if(season) form_data.append('season', season)
        if(material) form_data.append('material', material)
        if(countryOfOrigin) form_data.append('country_of_origin', countryOfOrigin)
        if(image) form_data.append('image', image)

        dispatch(updateProduct(productId, form_data))
    }

    if (productUpdationSuccess) {
        toast.info("Product successfully updated.")
        dispatch({
            type: UPDATE_PRODUCT_RESET
        })
        history.push(`/product/${product.id}`)
    }


    if (userInfo && tokenError === "Request failed with status code 401") {
        toast.info("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    return (
        <div>
            <span
                className="d-flex justify-content-center text-info"
            >
                <em>Edit Product</em>
            </span>
            {productUpdationError ? (
                <div>
                    {scrollToTop()}
                    <Message variant='danger'>{productUpdationError?.image?.[0]}</Message>
                </div>
            ) : ""}
            {loadingPageDetails && <span style={{ display: "flex" }}>
                <h5>Getting Product Details</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span>}
            {loadingProductUpdations ? <span style={{ display: "flex" }}>
                <h5>Updating Product</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span> : ""}
            <Form onSubmit={onSubmit}>

                <Form.Group controlId='image'>
                    <Form.Label>
                        <b>
                            Product Image
                        </b>
                    </Form.Label>
                    <p>
                        <img src={product.image} alt={product.name} height="200" />
                    </p>

                    {newImage ?
                        <div>
                            <Form.Control
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                            >
                            </Form.Control>

                            <span
                                onClick={() => {
                                    setNewImage(!newImage)
                                    setImage("")
                                    dispatch({
                                        type: UPDATE_PRODUCT_RESET
                                    })
                                }}
                                className="btn btn-primary btn-sm mt-2"
                            >
                                Cancel
                            </span>
                        </div>
                        :
                        <p>
                            <span
                                onClick={() => setNewImage(!newImage)}
                                className="btn btn-success btn-sm"
                            >
                                choose different image
                            </span>
                        </p>
                    }
                </Form.Group>

                <Form.Group controlId='name'>
                    <Form.Label>
                        <b>Product Name</b>
                    </Form.Label>
                    <Form.Control
                        autoFocus={true}
                        type="text"
                        defaultValue={product.name}
                        placeholder="product name"
                        onChange={(e) => setName(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='category'>
                    <Form.Label><b>Category (Ulgurji kiyim turi)</b></Form.Label>
                    <Form.Control
                        as="select"
                        defaultValue={product.category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Tanlang...</option>
                        <option value="Ayollar kiyimi">Ayollar kiyimi</option>
                        <option value="Erkaklar kiyimi">Erkaklar kiyimi</option>
                        <option value="Qizlar uchun kiyimlar">Qizlar uchun kiyimlar</option>
                        <option value="O'g'il bolalar uchun kiyimlar">O'g'il bolalar uchun kiyimlar</option>
                        <option value="Yangi tug'ilgan chaqaloqlar uchun kiyimlar">Yangi tug'ilgan chaqaloqlar uchun kiyimlar</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='brand'>
                    <Form.Label><b>Brand</b></Form.Label>
                    <Form.Control
                        as="select"
                        defaultValue={product.brand}
                        onChange={(e) => setBrand(e.target.value)}
                    >
                        <option value="">Tanlang...</option>
                        <option value="Gucci">Gucci</option>
                        <option value="Prada">Prada</option>
                        <option value="Nike">Nike</option>
                        <option value="Adidas">Adidas</option>
                        <option value="Zara">Zara</option>
                        <option value="H&M">H&M</option>
                        <option value="Louis Vuitton">Louis Vuitton</option>
                        <option value="Balenciaga">Balenciaga</option>
                        <option value="Boshqa">Boshqa</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='description'>
                    <Form.Label>
                        <b>
                            Product Description
                        </b>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        defaultValue={product.description}
                        placeholder="product description"
                        onChange={(e) => setDescription(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='price'>
                    <Form.Label>
                        <b>
                            Price
                        </b>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        pattern="[0-9]+(\.[0-9]{1,2})?%?"
                        defaultValue={product.price}
                        placeholder="199.99"
                        step="0.01"
                        maxLength="10"
                        onChange={(e) => setPrice(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='oldPrice'>
                    <Form.Label><b>Old Price (Optional)</b></Form.Label>
                    <Form.Control
                        type="text"
                        pattern="[0-9]+(\.[0-9]{1,2})?%?"
                        defaultValue={product.old_price}
                        placeholder="299.99"
                        step="0.01"
                        maxLength="10"
                        onChange={(e) => setOldPrice(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='stock'>
                    <Form.Label><b>Stock Quantity</b></Form.Label>
                    <Form.Control
                        type="number"
                        defaultValue={product.stock}
                        onChange={(e) => setStock(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='min_order'>
                    <Form.Label><b>Minimum Order Quantity (Ulgurji)</b></Form.Label>
                    <Form.Control
                        type="number"
                        defaultValue={product.min_order_quantity}
                        onChange={(e) => setMinOrderQuantity(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='color'>
                    <Form.Label><b>Color</b></Form.Label>
                    <Form.Control as="select" defaultValue={product.color} onChange={(e) => setColor(e.target.value)}>
                        <option value="">Tanlang...</option>
                        <option value="Oq">Oq</option>
                        <option value="Qora">Qora</option>
                        <option value="Qizil">Qizil</option>
                        <option value="Ko'k">Ko'k</option>
                        <option value="Yashil">Yashil</option>
                        <option value="Sariq">Sariq</option>
                        <option value="Jigarrang">Jigarrang</option>
                        <option value="Kulrang">Kulrang</option>
                        <option value="Pushti">Pushti</option>
                        <option value="Binafsharang">Binafsharang</option>
                        <option value="Aralash/Boshqa">Aralash/Boshqa</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='size'>
                    <Form.Label><b>Size</b></Form.Label>
                    <Form.Control as="select" defaultValue={product.size} onChange={(e) => setSize(e.target.value)}>
                        <option value="">Tanlang...</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                        <option value="3XL">3XL</option>
                        <option value="Oversize">Oversize</option>
                        <option value="Boshqa">Boshqa</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='season'>
                    <Form.Label><b>Season</b></Form.Label>
                    <Form.Control as="select" defaultValue={product.season} onChange={(e) => setSeason(e.target.value)}>
                        <option value="">Tanlang...</option>
                        <option value="Bahor">Bahor</option>
                        <option value="Yoz">Yoz</option>
                        <option value="Kuz">Kuz</option>
                        <option value="Qish">Qish</option>
                        <option value="Barcha fasllar uchun">Barcha fasllar uchun</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='material'>
                    <Form.Label><b>Material</b></Form.Label>
                    <Form.Control as="select" defaultValue={product.material} onChange={(e) => setMaterial(e.target.value)}>
                        <option value="">Tanlang...</option>
                        <option value="Paxta (Cotton)">Paxta (Cotton)</option>
                        <option value="Ipak (Silk)">Ipak (Silk)</option>
                        <option value="Jun (Wool)">Jun (Wool)</option>
                        <option value="Sintetika (Polyester)">Sintetika (Polyester)</option>
                        <option value="Jinsi (Denim)">Jinsi (Denim)</option>
                        <option value="Keten (Linen)">Keten (Linen)</option>
                        <option value="Boshqa">Boshqa</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='country_of_origin'>
                    <Form.Label><b>Country of Origin</b></Form.Label>
                    <Form.Control as="select" defaultValue={product.country_of_origin} onChange={(e) => setCountryOfOrigin(e.target.value)}>
                        <option value="">Tanlang...</option>
                        <option value="O'zbekiston">O'zbekiston</option>
                        <option value="Turkiya">Turkiya</option>
                        <option value="Xitoy">Xitoy</option>
                        <option value="Italiya">Italiya</option>
                        <option value="Fransiya">Fransiya</option>
                        <option value="AQSh">AQSh</option>
                        <option value="Boshqa">Boshqa</option>
                    </Form.Control>
                </Form.Group>

                <Button
                    type="submit"
                    variant='success'
                    className="btn-sm button-focus-css mb-4"
                >
                    Save Changes
                </Button>
                <Button
                    onClick={() => history.push(`/product/${product.id}`)}
                    variant='primary'
                    className="btn-sm ml-2 button-focus-css mb-4"
                >
                    Cancel
                </Button>
            </Form>
        </div>
    )
}

export default ProductUpdatePage
