import React, { useState } from 'react'
import { Form, Button, Card, InputGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { createUserAddress, getAllAddress } from '../actions/userActions'
import { CREATE_USER_ADDRESS_RESET } from '../constants'
import Message from './Message'
import { toast } from 'react-toastify'


const CreateAddressComponent = ({ toggleCreateAddress }) => {

    const dispatch = useDispatch()

    const [name, setName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [pinCode, setPinCode] = useState("")
    const [houseNumber, setHouseNumber] = useState("")
    const [landmark, setLandmark] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")

    // Create User Address Reducer
    const createUserAddressReducer = useSelector(state => state.createUserAddressReducer)
    const { success: addressCreationSuccess, error: errorCreatingAddress } = createUserAddressReducer

    const addressSubmitHandler = (e) => {
        e.preventDefault()

        if (!/^[0-9]{9}$/.test(phoneNumber)) {
            toast.error("Iltimos, telefon raqamini to'g'ri kiriting (9 ta raqam, masalan: 901234567)");
            return;
        }

        const addressData = {
            "name": name,
            "phone_number": `+998${phoneNumber}`,
            "pin_code": pinCode,
            "house_no": houseNumber,
            "landmark": landmark,
            "city": city,
            "state": state,
        }
        dispatch(createUserAddress(addressData))
    }

    if (addressCreationSuccess) {
        toast.success("Address successfully created.")
        toggleCreateAddress()
        dispatch({
            type: CREATE_USER_ADDRESS_RESET
        })
        dispatch(getAllAddress())
    }

    return (
        <div>
            <p className="text-center text-info"><em>New Address</em></p>
            {errorCreatingAddress
                ? <Message variant='danger'>
                    {errorCreatingAddress}
                </Message>
                :
                ""}
            <Card
                className="mx-auto mb-4"
                style={{ width: "80%", border: "1px solid", borderColor: "#C6ACE7" }}
            >
                <Card.Body>
                    <Form onSubmit={addressSubmitHandler}>

                        <Form.Group controlId='name'>
                            <Form.Label>
                                Name
                            </Form.Label>
                            <Form.Control
                                autoFocus={true}
                                type="text"
                                placeholder="enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='phoneNumber'>
                            <Form.Label>
                                Phone Number
                            </Form.Label>
                            <InputGroup>
                                <InputGroup.Text>+998</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Masalan: 901234567"
                                    pattern="[0-9]+"
                                    maxLength="9"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                >
                                </Form.Control>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group controlId='pinCode'>
                            <Form.Label>
                                Pin Code
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="pin code"
                                value={pinCode}
                                pattern="[0-9]+"
                                maxLength="6"
                                onChange={(e) => setPinCode(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='houseNumber'>
                            <Form.Label>
                                House No./Address
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="house number"
                                value={houseNumber}
                                onChange={(e) => setHouseNumber(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='landmark'>
                            <Form.Label>
                                Landmark
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="landmark"
                                value={landmark}
                                onChange={(e) => setLandmark(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='city'>
                            <Form.Label>
                                Shahar (City)
                            </Form.Label>
                            <Form.Control
                                as="select"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            >
                                <option value="">Tanlang...</option>
                                <option value="Toshkent">Toshkent</option>
                                <option value="Samarqand">Samarqand</option>
                                <option value="Buxoro">Buxoro</option>
                                <option value="Andijon">Andijon</option>
                                <option value="Farg'ona">Farg'ona</option>
                                <option value="Namangan">Namangan</option>
                                <option value="Navoiy">Navoiy</option>
                                <option value="Qarshi">Qarshi</option>
                                <option value="Termiz">Termiz</option>
                                <option value="Nukus">Nukus</option>
                                <option value="Urganch">Urganch</option>
                                <option value="Jizzax">Jizzax</option>
                                <option value="Guliston">Guliston</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='state'>
                            <Form.Label>
                                Viloyat (State)
                            </Form.Label>
                            <Form.Control
                                as="select"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            >
                                <option value="">Tanlang...</option>
                                <option value="Toshkent viloyati">Toshkent viloyati</option>
                                <option value="Samarqand viloyati">Samarqand viloyati</option>
                                <option value="Buxoro viloyati">Buxoro viloyati</option>
                                <option value="Andijon viloyati">Andijon viloyati</option>
                                <option value="Farg'ona viloyati">Farg'ona viloyati</option>
                                <option value="Namangan viloyati">Namangan viloyati</option>
                                <option value="Navoiy viloyati">Navoiy viloyati</option>
                                <option value="Qashqadaryo viloyati">Qashqadaryo viloyati</option>
                                <option value="Surxondaryo viloyati">Surxondaryo viloyati</option>
                                <option value="Xorazm viloyati">Xorazm viloyati</option>
                                <option value="Jizzax viloyati">Jizzax viloyati</option>
                                <option value="Sirdaryo viloyati">Sirdaryo viloyati</option>
                                <option value="Qoraqalpog'iston Respublikasi">Qoraqalpog'iston Respublikasi</option>
                            </Form.Control>
                        </Form.Group>

                        <Button
                            style={{ width: "100%" }}
                            className="btn-sm"
                            type="submit"
                            variant="success"
                        >
                            Save Address
                        </Button>
                        <Button
                            style={{ width: "100%" }}
                            className="btn-sm mt-2"
                            variant="primary"
                            onClick={() => toggleCreateAddress()}>
                            Cancel
                        </Button>
                    </Form>

                </Card.Body>
            </Card>
        </div>
    )
}

export default CreateAddressComponent
