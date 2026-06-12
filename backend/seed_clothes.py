import os
import django
import random

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "my_project.settings")
django.setup()

from product.models import Product, ProductImage, Review
from django.contrib.auth.models import User

products_data = [
    # Ayollar kiyimi
    {"name": "Yozgi Sariq Ko'ylak (Ayollar)", "category": "Ayollar kiyimi", "brand": "Mango", "price": "350000", "desc": "Yozgi issiq kunlar uchun yengil sariq ko'ylak.", "image": "prod_image_1.jpg"},
    {"name": "Kuzgi Moda Ko'ylak", "category": "Ayollar kiyimi", "brand": "Prada", "price": "450000", "desc": "Kuz mavsumi uchun mos moda ko'ylak.", "image": "prod_image_2.jpg"},
    {"name": "Klassik Shim", "category": "Ayollar kiyimi", "brand": "H&M", "price": "300000", "desc": "Ofis uchun klassik ayollar shimi.", "image": "prod_image_3.jpg"},
    {"name": "Baxorgi Yengil Ko'ylak", "category": "Ayollar kiyimi", "brand": "Gucci", "price": "1200000", "desc": "Baxorgi mavsum uchun gulli yengil ko'ylak.", "image": "prod_image_4.jpg"},
    {"name": "Qishki Qalin Palto", "category": "Ayollar kiyimi", "brand": "Burberry", "price": "3000000", "desc": "Qishning sovuq kunlari uchun qalin jun palto.", "image": "prod_image_5.jpg"},
    
    # Erkaklar kiyimi
    {"name": "Oq Futbolka", "category": "Erkaklar kiyimi", "brand": "Nike", "price": "150000", "desc": "Kundalik kiyish uchun 100% paxtali oq futbolka.", "image": "prod_image_6.jpg"},
    {"name": "Sport Krossovka", "category": "Erkaklar kiyimi", "brand": "Adidas", "price": "850000", "desc": "Yugurish va sport uchun qulay krossovka.", "image": "prod_image_7.jpg"},
    {"name": "Issiq Hudi (Kulrang)", "category": "Erkaklar kiyimi", "brand": "Puma", "price": "400000", "desc": "Qish va kuz mavsumi uchun qalin hudi.", "image": "prod_image_8.jpg"},
    {"name": "Zamonaviy Jinsi", "category": "Erkaklar kiyimi", "brand": "Levi's", "price": "550000", "desc": "Sifatli va chidamli jinsi shim.", "image": "prod_image_9.jpg"},
    {"name": "Klassik Erkaklar Kostyumi", "category": "Erkaklar kiyimi", "brand": "Hugo Boss", "price": "2500000", "desc": "To'y va tadbirlar uchun mukammal kostyum.", "image": "prod_image_10.jpg"},
    
    # Qizlar uchun kiyimlar
    {"name": "Qizlar uchun Yozgi Ko'ylakcha", "category": "Qizlar uchun kiyimlar", "brand": "Zara Kids", "price": "150000", "desc": "Yengil va qulay yozgi ko'ylakcha.", "image": "prod_image_11.jpg"},
    {"name": "Qizlar uchun Issiq Kurtka", "category": "Qizlar uchun kiyimlar", "brand": "H&M", "price": "350000", "desc": "Qishki issiq va zamonaviy kurtka.", "image": "prod_image_12.jpg"},
    {"name": "Maktab Formasi (Qizlar)", "category": "Qizlar uchun kiyimlar", "brand": "Marks & Spencer", "price": "250000", "desc": "Qulay va sifatli maktab formasi.", "image": "prod_image_13.jpg"},
    {"name": "Bayramona Qizlar Ko'ylagi", "category": "Qizlar uchun kiyimlar", "brand": "Dior Kids", "price": "500000", "desc": "Tug'ilgan kun va bayramlar uchun chiroyli ko'ylak.", "image": "prod_image_14.jpg"},
    {"name": "Qizlar uchun Krossovka", "category": "Qizlar uchun kiyimlar", "brand": "Nike", "price": "300000", "desc": "Yugurish va o'yinlar uchun qulay poyabzal.", "image": "prod_image_15.jpg"},
    
    # O'g'il bolalar uchun kiyimlar
    {"name": "O'g'il bolalar uchun Sport To'plam", "category": "O'g'il bolalar uchun kiyimlar", "brand": "Adidas", "price": "250000", "desc": "Sport bilan shug'ullanish uchun qulay to'plam.", "image": "prod_image_16.jpg"},
    {"name": "O'g'il bolalar uchun Jinsi", "category": "O'g'il bolalar uchun kiyimlar", "brand": "Levi's Kids", "price": "200000", "desc": "Bardoshli va chidamli jinsi shim.", "image": "prod_image_17.jpg"},
    {"name": "Maktab Formasi (O'g'il bolalar)", "category": "O'g'il bolalar uchun kiyimlar", "brand": "Next", "price": "280000", "desc": "Klassik uslubdagi maktab formasi.", "image": "prod_image_18.jpg"},
    {"name": "Kuzgi Kurtka (O'g'il bolalar)", "category": "O'g'il bolalar uchun kiyimlar", "brand": "Puma", "price": "320000", "desc": "Shamol va yomg'irdan himoya qiluvchi kurtka.", "image": "prod_image_19.jpg"},
    {"name": "O'g'il bolalar uchun Krossovka", "category": "O'g'il bolalar uchun kiyimlar", "brand": "Nike", "price": "290000", "desc": "Kundalik kiyish uchun qulay sport poyabzali.", "image": "prod_image_20.jpg"},
    
    # Yangi tug'ilgan chaqaloqlar uchun kiyimlar
    {"name": "Chaqaloqlar Uchun Body to'plami", "category": "Yangi tug'ilgan chaqaloqlar uchun kiyimlar", "brand": "Carter's", "price": "120000", "desc": "Yumshoq paxtadan 3 ta body to'plami.", "image": "prod_image_21.jpg"},
    {"name": "Chaqaloqlar Romperi", "category": "Yangi tug'ilgan chaqaloqlar uchun kiyimlar", "brand": "Mothercare", "price": "150000", "desc": "Issiq va qulay qishki romper.", "image": "prod_image_22.jpg"},
    {"name": "Chaqaloqlar Shapkachasi", "category": "Yangi tug'ilgan chaqaloqlar uchun kiyimlar", "brand": "H&M Baby", "price": "50000", "desc": "Yumshoq va issiq shapka.", "image": "prod_image_23.jpg"},
    {"name": "Uyqu Qopchasi", "category": "Yangi tug'ilgan chaqaloqlar uchun kiyimlar", "brand": "Chicco", "price": "180000", "desc": "Chaqaloqning tinch uxlashi uchun qulay qopcha.", "image": "prod_image_24.jpg"},
    {"name": "Chaqaloqlar Paypoqlari", "category": "Yangi tug'ilgan chaqaloqlar uchun kiyimlar", "brand": "Next Baby", "price": "40000", "desc": "Chaqaloqlar oyoqlari uchun issiq paypoqlar.", "image": "prod_image_25.jpg"}
]

# Randomize the array so they don't appear clumped by category!
random.shuffle(products_data)

try:
    user = User.objects.get(username='admin')
except User.DoesNotExist:
    user = User.objects.create_superuser('admin', 'admin@example.com', 'admin')

# Delete existing products so we have a clean state with correctly matched images
Product.objects.all().delete()

for i, data in enumerate(products_data):
    filename = data['image']
    
    p = Product.objects.create(
        name=data["name"],
        category=data["category"],
        brand=data["brand"],
        description=data["desc"],
        price=data["price"],
        old_price=str(int(data["price"]) * 1.2),
        stock=random.randint(10, 100),
        min_order_quantity=1,
        image=filename,
        rating=random.choice([4.0, 4.5, 5.0]),
        numReviews=random.randint(1, 10)
    )
    
    ProductImage.objects.create(product=p, image=filename)
    
    Review.objects.create(
        product=p,
        user=user,
        name="Test Xaridor",
        rating=5,
        comment="Juda ajoyib mahsulot ekan!"
    )

print("25 ta yangi mahsulot aralashtirilgan holda muvaffaqiyatli qo'shildi!")
