import os
import glob
import re

frontend_dir = r"d:\FullStack_Ecommerce_App-main\frontend"

# Fix GetDate.js
get_date_path = os.path.join(frontend_dir, "src", "components", "GetDate.js")
if os.path.exists(get_date_path):
    with open(get_date_path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace("Feburary", "February")
    with open(get_date_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix CreateAddressComponent.js
create_address_path = os.path.join(frontend_dir, "src", "components", "CreateAddressComponent.js")
if os.path.exists(create_address_path):
    with open(create_address_path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace("+91", "+998")
    content = content.replace('width: "50%"', 'width: "80%"')
    content = re.sub(r'(<Form\.Control[^>]*)(>)', r'\1 required\2', content)
    with open(create_address_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix CreateCardComponent.js
create_card_path = os.path.join(frontend_dir, "src", "components", "CreateCardComponent.js")
if os.path.exists(create_card_path):
    with open(create_card_path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('pattern=".+@gmail\\.com"', 'pattern=".+@.+\\..+"')
    content = content.replace('type="numbers"', 'type="text" pattern="[0-9]*"')
    with open(create_card_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix CardUpdatePage.js
card_update_path = os.path.join(frontend_dir, "src", "pages", "CardUpdatePage.js")
if os.path.exists(card_update_path):
    with open(card_update_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Change cancel button type submit to button
    content = re.sub(r'(<Button\s+variant="primary"\s+)type="submit"(\s+onClick=\{() => history.push\("/card-settings"\)\})', r'\1type="button"\2', content)
    with open(card_update_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix ProductCreatePage.js
prod_create_path = os.path.join(frontend_dir, "src", "pages", "ProductCreatePage.js")
if os.path.exists(prod_create_path):
    with open(prod_create_path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('type="submit" onClick={() => history.push("/admin/products-list/")}', 'type="button" onClick={() => history.push("/admin/products-list/")}')
    content = content.replace('{productCreationError.image[0]}', '{productCreationError?.image?.[0]}')
    with open(prod_create_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix ProductUpdatePage.js
prod_update_path = os.path.join(frontend_dir, "src", "pages", "ProductUpdatePage.js")
if os.path.exists(prod_update_path):
    with open(prod_update_path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('{productUpdationError.image[0]}', '{productUpdationError?.image?.[0]}')
    with open(prod_update_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix CheckoutPage.js
checkout_path = os.path.join(frontend_dir, "src", "pages", "CheckoutPage.js")
if os.path.exists(checkout_path):
    with open(checkout_path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('xs={6}', 'xs={12} md={6}')
    with open(checkout_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Change currency
for root, _, files in os.walk(frontend_dir):
    if "node_modules" in root or "build" in root:
        continue
    for file in files:
        if file.endswith('.js') or file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            if '₹' in content or 'Rs.' in content or 'Rs ' in content:
                content = content.replace('₹', "so'm ")
                content = content.replace('Rs.', "so'm ")
                content = content.replace('Rs ', "so'm ")
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)

# Fix index.html
index_html_path = os.path.join(frontend_dir, "public", "index.html")
if os.path.exists(index_html_path):
    with open(index_html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('<title>React App</title>', '<title>E-Commerce Do\'kon</title>')
    with open(index_html_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix LoginPage.js
login_path = os.path.join(frontend_dir, "src", "pages", "LoginPage.js")
if os.path.exists(login_path):
    with open(login_path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = re.sub(r'(<Form\.Control\s+[^>]*type="(?:text|password)"[^>]*)(>)', r'\1 required\2', content)
    with open(login_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix RegisterPage.js
register_path = os.path.join(frontend_dir, "src", "pages", "RegisterPage.js")
if os.path.exists(register_path):
    with open(register_path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = re.sub(r'(<Form\.Control\s+[^>]*type="(?:text|email)"[^>]*)(>)', r'\1 required\2', content)
    content = re.sub(r'(<Form\.Control\s+[^>]*type="password"[^>]*)(>)', r'\1 required minLength="6"\2', content)
    with open(register_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix AccountPage.js
account_path = os.path.join(frontend_dir, "src", "pages", "AccountPage.js")
if os.path.exists(account_path):
    with open(account_path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('xs={2}', 'xs={4} md={2}')
    with open(account_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix store.js
store_path = os.path.join(frontend_dir, "src", "store.js")
if os.path.exists(store_path):
    with open(store_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "composeEnhancers" not in content:
        content = content.replace(
            "import { createStore, combineReducers, applyMiddleware } from 'redux'", 
            "import { createStore, combineReducers, applyMiddleware, compose } from 'redux'"
        )
        content = content.replace(
            "const middleware = [thunk]",
            "const middleware = [thunk]\nconst composeEnhancers = process.env.NODE_ENV === 'development' ? composeWithDevTools : compose;"
        )
        content = content.replace(
            "composeWithDevTools(applyMiddleware(...middleware))",
            "composeEnhancers(applyMiddleware(...middleware))"
        )
        with open(store_path, 'w', encoding='utf-8') as f:
            f.write(content)

print("Frontend fixes applied!")
