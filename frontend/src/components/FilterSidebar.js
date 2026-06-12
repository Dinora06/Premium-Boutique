import React from 'react'
import { Form } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'

const FilterSidebar = () => {
    let history = useHistory()
    let location = useLocation()

    const searchParams = new URLSearchParams(location.search)

    const handleFilterChange = (filterName, value) => {
        if (value) {
            searchParams.set(filterName, value)
        } else {
            searchParams.delete(filterName)
        }
        searchParams.set('page', 1)
        history.push(`/?${searchParams.toString()}`)
    }

    const categories = ['Ayollar kiyimi', 'Erkaklar kiyimi', "Qizlar uchun kiyimlar", "O'g'il bolalar uchun kiyimlar", "Yangi tug'ilgan chaqaloqlar uchun kiyimlar"]
    const brands = ['Gucci', 'Prada', 'Nike', 'Adidas', 'Puma']
    const colors = ['Jigarrang', 'Qizil', 'Yashil', 'Xaki', 'Binafsharang', 'Pushti']
    const sizes = ['32', '34', '36', '38', 'M/L', '4XL']
    const seasons = ['Bahor', 'Qish', 'Yoz', 'Kuz']

    return (
        <div className="filter-sidebar">
            <div className="filter-section">
                <div className="filter-title">Turkumlar</div>
                {categories.map((cat, idx) => (
                    <div 
                        key={idx} 
                        className="filter-checkbox"
                        onClick={() => handleFilterChange('category', cat)}
                        style={{ fontWeight: searchParams.get('category') === cat ? 'bold' : 'normal', color: searchParams.get('category') === cat ? 'var(--primary)' : 'inherit' }}
                    >
                        {cat}
                    </div>
                ))}
            </div>

            <div className="filter-section">
                <div className="filter-title">Narx, baho, so'm</div>
                <div className="d-flex align-items-center mb-3">
                    <Form.Control 
                        type="number" 
                        placeholder="dan 100" 
                        value={searchParams.get('min_price') || ''} 
                        onChange={(e) => handleFilterChange('min_price', e.target.value)} 
                        className="mr-2"
                    />
                    <Form.Control 
                        type="number" 
                        placeholder="gacha 99999" 
                        value={searchParams.get('max_price') || ''} 
                        onChange={(e) => handleFilterChange('max_price', e.target.value)} 
                    />
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-title">Mavsum</div>
                {seasons.map((season, idx) => (
                    <label key={idx} className="filter-checkbox">
                        <input 
                            type="checkbox" 
                            checked={searchParams.get('season') === season}
                            onChange={(e) => handleFilterChange('season', e.target.checked ? season : '')}
                        />
                        {season}
                    </label>
                ))}
            </div>

            <div className="filter-section">
                <div className="filter-title">Rang</div>
                {colors.map((color, idx) => (
                    <label key={idx} className="filter-checkbox">
                        <input 
                            type="checkbox" 
                            checked={searchParams.get('color') === color}
                            onChange={(e) => handleFilterChange('color', e.target.checked ? color : '')}
                        />
                        {color}
                    </label>
                ))}
            </div>

            <div className="filter-section">
                <div className="filter-title">O'lchami</div>
                {sizes.map((size, idx) => (
                    <label key={idx} className="filter-checkbox">
                        <input 
                            type="checkbox" 
                            checked={searchParams.get('size') === size}
                            onChange={(e) => handleFilterChange('size', e.target.checked ? size : '')}
                        />
                        {size}
                    </label>
                ))}
            </div>

            <div className="filter-section">
                <div className="filter-title">Brend</div>
                {brands.map((brand, idx) => (
                    <label key={idx} className="filter-checkbox">
                        <input 
                            type="checkbox" 
                            checked={searchParams.get('brand') === brand}
                            onChange={(e) => handleFilterChange('brand', e.target.checked ? brand : '')}
                        />
                        {brand}
                    </label>
                ))}
            </div>

            <button 
                className="btn btn-outline-dark btn-sm w-100 mt-2"
                onClick={() => history.push('/')}
            >
                Filtrlarni tozalash
            </button>
        </div>
    )
}

export default FilterSidebar
