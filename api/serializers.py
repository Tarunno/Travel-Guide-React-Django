from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class PlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = '__all__'

class UserRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=100, min_length=1)
    first_name = serializers.CharField(max_length=100, min_length=1)
    last_name = serializers.CharField(max_length=100, min_length=1)
    email = serializers.EmailField(max_length=200, min_length=1)
    password = serializers.CharField(max_length=200, min_length=1, write_only=True)

    class Meta:
        model = User
        fields = ['username','first_name', 'last_name', 'email', 'password']

    def validate(self, attrs):
        email = attrs.get('email')
        username = attrs.get('username')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "This email already in use!"})
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"email": "This username already in use!"})
        return super().validate(attrs)

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)  # or every value will be put in username field!


class UserAuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Traveler
        fields = ['id', 'user', 'image']

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields = ['id', 'user', 'place', 'comment']
