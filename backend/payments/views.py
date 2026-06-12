import stripe
from rest_framework import status
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from account.models import StripeModel, OrderModel
from rest_framework.decorators import permission_classes
from datetime import datetime
import uuid

def save_card_in_db(cardData, email, cardId, customer_id, user):
    # save card in django stripe model
    StripeModel.objects.create(
        email = email,
        customer_id = customer_id,
        card_number=cardData["number"][-4:],
        exp_month = cardData["exp_month"],
        exp_year = cardData["exp_year"],
        card_id = cardId,
        user = user,
    )


# Just for testing
class TestStripeImplementation(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        return Response(data={"message": "simulated test payment"}, status=status.HTTP_200_OK)

# check token expired or not
class CheckTokenValidation(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response("Token is Valid", status=status.HTTP_200_OK)


# to create card token (to validate your card)
class CreateCardTokenView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        email = request.data.get("email", request.user.email)
        cardStatus = request.data.get("save_card", False)
        
        # Simulate stripe success
        fake_card_id = "card_" + str(uuid.uuid4()).replace("-", "")[:24]
        fake_customer_id = "cus_" + str(uuid.uuid4()).replace("-", "")[:14]
        
        create_user_card = {
            "id": fake_card_id,
            "last4": data["number"][-4:],
            "exp_month": data["exp_month"],
            "exp_year": data["exp_year"],
            "brand": "Visa"
        }

        if cardStatus:
            try:
                save_card_in_db(data, email, fake_card_id, fake_customer_id, request.user)
                message = {"customer_id": fake_customer_id, "email": email, "card_data": create_user_card}
                return Response(message, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({ 
                    "detail": "Card already in use or error saving. " + str(e)},
                    status=status.HTTP_400_BAD_REQUEST)
        else:
            message = {"customer_id": fake_customer_id, "email": email, "card_data": create_user_card}
            return Response(message, status=status.HTTP_200_OK)

# Charge the customer card
class ChargeCustomerView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            email = request.data.get("email", request.user.email)

            # SIMULATE PAYMENT SUCCESS

            del_at = data.get("delivered_at", None)
            if del_at == "Not Delivered":
                del_at = None

            # saving order in django database
            new_order = OrderModel.objects.create(
                name = data["name"],
                address = data.get("address", ""),
                card_number = data["card_number"],
                ordered_item = data["ordered_item"],
                paid_status = data["paid_status"],
                paid_at = datetime.now(),
                total_price = data["total_price"],
                is_delivered = data["is_delivered"],
                delivered_at = del_at,
                user = request.user
            )

            return Response(
                data = {
                    "data": {
                        "customer_id": "cus_fake_123",
                        "message": "Payment Successfull",
                    }
                }, status=status.HTTP_200_OK)

        except Exception as e:            
            return Response({ 
                "detail": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )


# retrieve card (to get user card details)
class RetrieveCardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request): 
        try:
            card_id = request.headers.get("Card-Id")
            card = StripeModel.objects.filter(card_id=card_id, user=request.user).first()
            if card:
                card_details = {
                    "id": card.card_id,
                    "last4": card.card_number,
                    "exp_month": card.exp_month,
                    "exp_year": card.exp_year,
                    "name": card.name_on_card
                }
                return Response(card_details, status=status.HTTP_200_OK)
            return Response({"detail": "Card not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

# update a card
class CardUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            update_card = {"status": "updated"}

            # locating stripe object in django database
            try:
                obj = StripeModel.objects.get(card_number=request.data["card_number"], user=request.user)
                # updating stripe object in django database
                obj.name_on_card = data["name_on_card"] if data.get("name_on_card") else obj.name_on_card
                obj.exp_month = data["exp_month"] if data.get("exp_month") else obj.exp_month
                obj.exp_year = data["exp_year"] if data.get("exp_year") else obj.exp_year
                obj.address_city = data["address_city"] if data.get("address_city") else obj.address_city
                obj.address_country = data["address_country"] if data.get("address_country") else obj.address_country
                obj.address_state = data["address_state"] if data.get("address_state") else obj.address_state
                obj.address_zip = data["address_zip"] if data.get("address_zip") else obj.address_zip
                obj.save()
            except StripeModel.DoesNotExist:
                pass

            return Response(
                {
                    "detail": "card updated successfully",
                    "data": { "Updated Card": update_card },

                }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

# delete card
class DeleteCardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            obj_card = StripeModel.objects.filter(card_number=request.data["card_number"], user=request.user).first()
            if obj_card:
                obj_card.delete()
            return Response("Card deleted successfully.", status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)