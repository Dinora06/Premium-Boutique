from django.urls import path
from product import views


urlpatterns = [
    path('products/', views.ProductView.as_view(), name="products-list"),
    path('product/<int:pk>/', views.ProductDetailView.as_view(), name="product-details"),
    path('product-create/', views.ProductCreateView.as_view(), name="product-create"),
    path('product-update/<int:pk>/', views.ProductEditView.as_view(), name="product-update"),
    path('product-delete/<int:pk>/', views.ProductDeleteView.as_view(), name="product-delete"),
    path('product/<int:pk>/upload-image/', views.ProductImageUploadView.as_view(), name="product-upload-image"),
    path('product/<int:pk>/reviews/', views.ProductReviewCreateView.as_view(), name="product-create-review"),
    path('wishlist/', views.WishlistView.as_view(), name="wishlist"),
    path('wishlist/<int:pk>/', views.WishlistView.as_view(), name="wishlist-action"),
]