from .models import Product
from rest_framework import status
from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import ProductSerializer
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework.decorators import permission_classes


from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

class ProductView(APIView):

    def get(self, request):
        query = request.query_params.get('keyword', '')
        
        # Advanced Filters
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        color = request.query_params.get('color')
        size = request.query_params.get('size')
        season = request.query_params.get('season')
        material = request.query_params.get('material')
        brand = request.query_params.get('brand')
        country = request.query_params.get('country')
        category = request.query_params.get('category')

        filters = {'name__icontains': query}
        
        if min_price:
            filters['price__gte'] = min_price
        if max_price:
            filters['price__lte'] = max_price
        if color:
            filters['color__iexact'] = color
        if size:
            filters['size__iexact'] = size
        if season:
            filters['season__iexact'] = season
        if material:
            filters['material__iexact'] = material
        if brand:
            filters['brand__iexact'] = brand
        if country:
            filters['country_of_origin__iexact'] = country
        if category:
            filters['category__iexact'] = category
            
        products = Product.objects.filter(**filters).order_by('-id')
        
        page = request.query_params.get('page')
        paginator = Paginator(products, 8) # 8 products per page
        
        try:
            products = paginator.page(page)
        except PageNotAnInteger:
            products = paginator.page(1)
        except EmptyPage:
            products = paginator.page(paginator.num_pages)
            
        if page == None:
            page = 1
            
        page = int(page)

        serializer = ProductSerializer(products, many=True)
        return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages}, status=status.HTTP_200_OK)


class ProductDetailView(APIView):

    def get(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
            serializer = ProductSerializer(product, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)


class ProductCreateView(APIView):

    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        user = request.user
        data = request.data

        product = {
            "name": data.get("name", ""),
            "category": data.get("category", ""),
            "brand": data.get("brand", ""),
            "description": data.get("description", ""),
            "price": data.get("price", "0.00"),
            "old_price": data.get("old_price", None),
            "stock": data.get("stock", 0),
            "min_order_quantity": data.get("min_order_quantity", 1),
            "color": data.get("color", ""),
            "size": data.get("size", ""),
            "season": data.get("season", ""),
            "material": data.get("material", ""),
            "country_of_origin": data.get("country_of_origin", ""),
            "image": data.get("image", None),
        }

        serializer = ProductSerializer(data=product, many=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ProductDeleteView(APIView):

    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
            product.delete()
            return Response({"detail": "Product successfully deleted."}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)


class ProductEditView(APIView):
    
    permission_classes = [permissions.IsAdminUser]

    def put(self, request, pk):
        try:
            data = request.data
            product = Product.objects.get(id=pk)
            
            updated_product = {
                "name": data.get("name", product.name),
                "category": data.get("category", product.category),
                "brand": data.get("brand", product.brand),
                "description": data.get("description", product.description),
                "price": data.get("price", product.price),
                "old_price": data.get("old_price", product.old_price),
                "stock": data.get("stock", product.stock),
                "min_order_quantity": data.get("min_order_quantity", product.min_order_quantity),
                "color": data.get("color", product.color),
                "size": data.get("size", product.size),
                "season": data.get("season", product.season),
                "material": data.get("material", product.material),
                "country_of_origin": data.get("country_of_origin", product.country_of_origin),
                "image": data.get("image", product.image),
            }

            serializer = ProductSerializer(product, data=updated_product)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

class ProductImageUploadView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
            image = request.data.get('image')
            if image:
                from .models import ProductImage
                ProductImage.objects.create(product=product, image=image)
                return Response("Image uploaded successfully", status=status.HTTP_200_OK)
            return Response({"detail": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

class ProductReviewCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
            user = request.user
            data = request.data
            
            from .models import Review
            # Check if user already reviewed
            alreadyExists = product.reviews.filter(user=user).exists()
            if alreadyExists:
                return Response({'detail': 'Siz allaqachon sharh qoldirgansiz'}, status=status.HTTP_400_BAD_REQUEST)
            elif data.get('rating') == 0 or data.get('rating') == None:
                return Response({'detail': 'Iltimos baho bering'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                review = Review.objects.create(
                    user=user,
                    product=product,
                    name=user.first_name or user.username,
                    rating=data.get('rating'),
                    comment=data.get('comment')
                )
                reviews = product.reviews.all()
                product.numReviews = len(reviews)
                total = 0
                for r in reviews:
                    total += r.rating
                product.rating = total / len(reviews)
                product.save()
                return Response('Sharh qoldirildi', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

class WishlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        from .models import Wishlist
        from .serializers import WishlistSerializer
        wishlist = Wishlist.objects.filter(user=user).order_by('-createdAt')
        serializer = WishlistSerializer(wishlist, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, pk):
        try:
            user = request.user
            product = Product.objects.get(id=pk)
            from .models import Wishlist
            wishlist_item, created = Wishlist.objects.get_or_create(user=user, product=product)
            if created:
                return Response({'detail': 'Sevimlilarga qo\'shildi'}, status=status.HTTP_201_CREATED)
            else:
                wishlist_item.delete()
                return Response({'detail': 'Sevimlilardan olib tashlandi'}, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
