from .models import StripeModel, BillingAddress, OrderModel
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    admin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "admin"]

    def get_admin(self, obj):
        return obj.is_staff


# creating tokens manually (with user registration we will also create tokens)
class UserRegisterTokenSerializer(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "admin", "token"]

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


# list of cards
class CardsListSerializer(serializers.ModelSerializer):

    class Meta:
        model = StripeModel
        fields = ["id", "email", "name_on_card", "card_number", "exp_month", "exp_year", "address_city", "address_country", "address_state", "address_zip"]


# billing address details
class BillingAddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = BillingAddress
        fields = "__all__"


# all orders list
class AllOrdersListSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderModel
        fields = "__all__"