import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import { createProduct } from '../actions/productActions'
import { useHistory } from 'react-router'
import { checkTokenValidation, logout } from '../actions/userActions'
import { CREATE_PRODUCT_RESET } from '../constants'
import Message from '../components/Message';
import { toast } from 'react-toastify'


const ProductCreatePage = () => {

    let history = useHistory()
    const dispatch = useDispatch()

    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [brand, setBrand] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [oldPrice, setOldPrice] = useState("")
    const [stock, setStock] = useState(0)
    const [minOrderQuantity, setMinOrderQuantity] = useState(1)
    const [color, setColor] = useState("")
    const [size, setSize] = useState("")
    const [season, setSeason] = useState("")
    const [material, setMaterial] = useState("")
    const [countryOfOrigin, setCountryOfOrigin] = useState("")
    const [image, setImage] = useState(null)

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // create product reducer
    const createProductReducer = useSelector(state => state.createProductReducer)
    const { product, success: productCreationSuccess, error: productCreationError } = createProductReducer

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        }
        dispatch(checkTokenValidation())
    }, [dispatch, userInfo, history])

    const onSubmit = (e) => {
        e.preventDefault()

        let form_data = new FormData()
        form_data.append('name', name)
        form_data.append('category', category)
        form_data.append('brand', brand)
        form_data.append('description', description)
        form_data.append('price', price)
        form_data.append('old_price', oldPrice)
        form_data.append('stock', stock)
        form_data.append('min_order_quantity', minOrderQuantity)
        form_data.append('color', color)
        form_data.append('size', size)
        form_data.append('season', season)
        form_data.append('material', material)
        form_data.append('country_of_origin', countryOfOrigin)
        form_data.append('image', image)

        dispatch(createProduct(form_data))
    }

    if (productCreationSuccess) {
        toast.info("Product successfully created.")
        history.push(`/product/${product.id}/`)
        dispatch({
            type: CREATE_PRODUCT_RESET
        })
    }

    if (userInfo && tokenError === "Request failed with status code 401") {
        toast.info("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    return (
        <div>
            {productCreationError && <Message variant='danger'>{productCreationError?.image?.[0]}</Message>}
            <span
                className="d-flex justify-content-center text-info"
                >
                <em>New Product</em>
            </span>
            <Form onSubmit={onSubmit}>

                <Form.Group controlId='name'>
                    <Form.Label>
                        <b>
                            Product Name
                        </b>
                    </Form.Label>
                    <Form.Control
                        required
                        autoFocus={true}
                        type="text"
                        value={name}
                        placeholder="product name"
                        onChange={(e) => setName(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='category'>
                    <Form.Label><b>Category (Ulgurji kiyim turi)</b></Form.Label>
                    <Form.Control
                        as="select"
                        value={category}
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
                        value={brand}
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
                        required
                        type="text"
                        value={description}
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
                        required
                        type="text"
                        pattern="[0-9]+(\.[0-9]{1,2})?%?"
                        value={price}
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
                        value={oldPrice}
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
                        required
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='min_order'>
                    <Form.Label><b>Minimum Order Quantity (Ulgurji)</b></Form.Label>
                    <Form.Control
                        required
                        type="number"
                        value={minOrderQuantity}
                        onChange={(e) => setMinOrderQuantity(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='color'>
                    <Form.Label><b>Color</b></Form.Label>
                    <Form.Control as="select" value={color} onChange={(e) => setColor(e.target.value)}>
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
                    <Form.Control as="select" value={size} onChange={(e) => setSize(e.target.value)}>
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
                    <Form.Control as="select" value={season} onChange={(e) => setSeason(e.target.value)}>
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
                    <Form.Control as="select" value={material} onChange={(e) => setMaterial(e.target.value)}>
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
                    <Form.Control as="select" value={countryOfOrigin} onChange={(e) => setCountryOfOrigin(e.target.value)}>
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

                <Form.Group controlId='image'>
                    <Form.Label>
                        <b>
                            Product Image
                        </b>
                    </Form.Label>
                    <Form.Control
                        required
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    >
                    </Form.Control>
                </Form.Group>

                <Button
                    type="submit"
                    variant='success'
                    className="btn-sm button-focus-css"
                >
                    Save Product
                </Button>
                <Button
                    type="submit"
                    variant='primary'
                    className="btn-sm ml-2 button-focus-css"
                    onClick={() => history.push("/")}
                >
                    Cancel
                </Button>
            </Form>
        </div>
    )
}

export default ProductCreatePage
