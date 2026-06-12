import React, { useState } from 'react'
import {useHistory} from 'react-router-dom'


function SearchBarForProducts() {

    let history = useHistory()
    const [searchTerm, setSearchTerm] = useState("")

    const onSubmit = (e) => {
        e.preventDefault();
        if(searchTerm) {
            history.push(`/?keyword=${searchTerm}`)
        } else {
            history.push('/')
        }
    };

    return (
        <div className="search-container mr-auto ml-lg-3 mt-2 mt-lg-0 w-100">
            <form onSubmit={onSubmit} className="w-100">
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <input
                        type="text"
                        value={searchTerm}
                        placeholder="Mahsulotlar va toifalarni qidirish..."
                        className="form-control flex-grow-1"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn"
                    ><i className="fas fa-search"></i>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SearchBarForProducts
