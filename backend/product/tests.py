from account import views
from django.http import response
from .models import Product
from django.test import TestCase, Client
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework.test import force_authenticate
from rest_framework.test import APIRequestFactory
from .views import ProductCreateView, ProductDeleteView, ProductEditView
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile


class ProductApiTest(TestCase):

    def setUp(self):
        self.product = Product.objects.create(
            name='Test Product',
            description='Great Product',
            price=399.99,
            stock=1,
            image='apple.png'
        )

    def test_home_page_api(self):
        response = self.client.get("/api/products/")
        self.assertEqual(response.status_code, 200)

    def test_string_representation(self):
        product = Product(name="Sample Product")
        self.assertEqual(str(product), "Sample Product")

    def test_product_values(self):
        self.assertEqual(f"{self.product.name}", "Test Product")
        self.assertEqual(f"{self.product.description}", "Great Product")
        self.assertEqual(f"{self.product.price}", "399.99")
        self.assertEqual(f"{self.product.stock}", "1")
        self.assertEqual(f"{self.product.image}", "apple.png")

    def test_products_list_page_contents(self):
        response = self.client.get(reverse("products-list"))
        self.assertContains(response, "Test Product")
        self.assertContains(response, "399.99")

    def test_product_details_page(self):
        response = self.client.get(f"/api/product/{self.product.id}/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test Product")
        self.assertContains(response, "Great Product")
        self.assertContains(response, "399.99")


class ProductApisSetUp(APITestCase):

    def setUp(self):
        self.product = Product.objects.create(
            name='Test Product 2',
            description='Great game',
            price=1224.99,
            stock=1,
            image='no_preview_image.png'
        )

        self.admin_user = User.objects.create_superuser(
            username="admin",
            email="admin@gmail.com",
            password="admin1234"
        )

        self.normal_user = User.objects.create_user(
            username="testuser",
            email="testuser@gmail.com",
            password="testuser1234"
        )


class ProductApisAuthTest(ProductApisSetUp):

    def test_address_page_without_login_credentials(self):
        response = self.client.get('/accounts/all-address-details/')
        self.assertEqual(response.status_code, 404)

    def test_product_create_page_with_non_admin_credentials(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = ProductCreateView.as_view()

        new_product = {
            "name": "smart phone",
            "description": "great phone",
            "price": "400.99",
            "stock": "1",
        }

        request = factory.post('/api/product-create/', new_product, format="json")
        force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(response.status_code, 403)
    
    def test_product_create_page_with_admin_credentials(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='admin')
        view = ProductCreateView.as_view()

        new_product = {
            "name": "smart phone",
            "description": "great phone",
            "price": "400.99",
            "stock": "1",
        }

        request = factory.post('/api/product-create/', new_product, format="json")
        force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(response.status_code, 200)
    
    def test_product_edit_page_with_admin_credentials(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='admin')
        view = ProductEditView.as_view()

        updated_product = {
            "name": "Updated",
            "description": "Desc",
            "price": "400.99",
            "stock": "1",
        }

        request = factory.put(f'/api/product-update/{self.product.id}/', updated_product, format="json")
        force_authenticate(request, user=user)
        response = view(request, self.product.id)
        self.assertEqual(response.status_code, 200)
    
    def test_product_edit_page_without_admin_credentials(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = ProductEditView.as_view()

        updated_product = {
            "name": "Updated",
            "description": "Desc",
            "price": "400.99",
            "stock": "1",
        }

        request = factory.put(f'/api/product-update/{self.product.id}/', updated_product, format="json")
        force_authenticate(request, user=user)
        response = view(request, self.product.id)
        self.assertEqual(response.status_code, 403)

    def test_product_deletion_with_admin_credentials(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='admin')
        view = ProductDeleteView.as_view()

        request = factory.delete(f'/api/product-delete/{self.product.id}/')
        force_authenticate(request, user=user)
        response = view(request, self.product.id)
        self.assertEqual(response.status_code, 204)
    
    def test_product_deletion_without_admin_credentials(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = ProductDeleteView.as_view()

        request = factory.delete(f'/api/product-delete/{self.product.id}/')
        force_authenticate(request, user=user)
        response = view(request, self.product.id)
        self.assertEqual(response.status_code, 403)
