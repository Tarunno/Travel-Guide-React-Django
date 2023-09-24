from django.shortcuts import render, redirect
from rest_framework.decorators import api_view, authentication_classes, permission_classes

from rest_framework.response import Response
from rest_framework import status
import json

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .serializers import *
from .models import *

@api_view(['GET'])
def ApiOverView(request):
    api_urls = {
        'Categories': '/category-list/',
        'Category': '/category/<str:pk>',
        'Category Place': '/category-place/<str:pk>',
        'Place': '/place/<str:pk>',
        'User Registration': 'user-register/',
        'Login User': 'user-login/',
        'Logout User': 'user-logout/',
        'Profile': 'user-profile/<str:pk>',
        'User Details': 'user-details/<str:username>',
        'User Pin-place': 'user-pin-place/<str:token>',
        'User Pin-check': 'pin-check/<str:pk>/<str:username>',
        'User Pin-swap': 'pin-swap/<str:pk>/<str:username>',
        'User Love-check': 'love-check/<str:pk>/<str:username>',
        'User Love-swap': 'love-swap/<str:pk>/<str:username>',
        'Place Comments': 'comments/<str:pk>/<str:start/<str:end>',
        'Add Comment': 'comment-add/',
        'Profile Photo': 'profile-photo/'
    }
    return Response(api_urls)

@api_view(['GET'])
def CategoryList(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def CategoryPlace(request, pk):
    try:
        category = Category.objects.get(id=pk)
    except Category.DoesNotExist:
        return Response(
            {'message': 'Invalid category'},
            status=status.HTTP_404_NOT_FOUND
        )
    places = Place.objects.filter(category=category).all()
    serializer = PlaceSerializer(places, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def CategoryName(request, pk):
    try:
        category = Category.objects.get(id=pk)
    except Category.DoesNotExist:
        return Response(
            {'message': 'Invalid category'},
            status=status.HTTP_404_NOT_FOUND
        )
    return Response({category.name})

@api_view(['GET'])
def PlaceDetails(request, pk):
    try:
        place = Place.objects.get(id=pk)
    except Place.DoesNotExist:
        return Response(
            {'message': 'Invalid place'},
            status=status.HTTP_404_NOT_FOUND
        )
    serializer = PlaceSerializer(place, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def UserRegistration(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        email = request.data.get('email')
        user = User.objects.get(email=email)
        auth_token = Token(user=user)
        auth_token.save()
        traveler = Traveler(user=user)
        traveler.save()
        return Response({
            "email": [email]
        })
    return Response(serializer.errors)

@api_view(['POST'])
def UserLogin(request):
    serializer = UserAuthSerializer(data=request.data)
    return Response(serializer.data)

@api_view(['GET'])
def UserProfile(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(
            {'message': 'User doesn\'t exists'},
            status=status.HTTP_404_NOT_FOUND
        )
    id = user.id
    profile = Traveler.objects.get(user=id)
    serializer = ProfileSerializer(profile, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def UserDetail(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(
            {'message': 'User doesn\'t exists'},
            status=status.HTTP_404_NOT_FOUND
        )
    serializer = UserDetailSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def UserPinPlace(request, token):
    try:
        user = Token.objects.get(key=token)
        user = user.user
        if user != request.user:
            raise Token.DoesNotExist()
    except Token.DoesNotExist:
        return Response(
            {'message': 'Invalid token'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    pinplaces = PinPlace.objects.filter(user=user)
    places = []
    for place in pinplaces:
        dic = {
            'id': place.place.id,
            'title': place.place.title,
            'category': place.place.category,
            'image': place.place.image,
            'description': place.place.description,
            'love': place.place.love
        }
        places.append(dic)
    serializer = PlaceSerializer(places, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def PinCheck(request, pk, username):
    place = Place.objects.get(id=pk)
    user = User.objects.get(username=username)
    pinned = False
    for pinplace in PinPlace.objects.all():
        if place == pinplace.place:
            if user == pinplace.user:
                pinned = True
    return Response({'pinned': pinned})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def PinSwap(request, pk, username):
    target = Place.objects.get(id=pk)
    user = User.objects.get(username=username)
    pinned, found = False, False
    pinplaces = PinPlace.objects.filter(user=user)
    for place in pinplaces:
        if place.place == target and place.user == user:
            place.delete()
            pinned = False
            found = True
    if not found:
        PinPlace.objects.create(user=user, place=target)
        pinned = True
    return Response({'pinned': pinned})

@api_view(['GET'])
def LoveCheck(request, pk, username):
    count, loved = 0, False
    place = Place.objects.get(id=pk)
    if username == 'default':
        count = place.love.count()
    else:
        user = User.objects.get(username=username)
        loved = False
        count = place.love.count()
        if user in place.love.all():
            loved = True
    return Response({'loved': loved, 'count_love': count})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def LoveSwap(request, pk, username):
    count, loved = 0, False
    place = Place.objects.get(id=pk)
    user = User.objects.get(username=username)
    loved = False
    if user in place.love.all():
        place.love.remove(user)
        loved = False
    else:
        place.love.add(user)
        loved = True
    count = place.love.count()
    return Response({'loved': loved, 'count_love': count})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def PlaceComments(request, pk, start, end):
    place = Place.objects.get(id=pk)
    count = Comments.objects.filter(place=place).order_by('-time').count()
    comments = Comments.objects.filter(place=place).order_by('-time')[int(start):int(end)]
    list_comments = []
    for comment in comments:
        image = ""
        if comment.user.traveler.image == "":
            image = "localhost:8000/static/images/default.png"
        else:
            image = "localhost:8000/travel"+comment.user.traveler.image.url,
        dic = {
            'id': comment.id,
            'comment': comment.comment,
            'user': str(comment.user),
            'username': comment.user.first_name + " " + comment.user.last_name,
            'image': image,
            'time': str(comment.time)
        }
        list_comments.append(dic)
    res = [list_comments]
    res.append({'count_comment': count})
    return Response(json.dumps(res))

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def CommentAdd(request):
    auth_user = request.user
    data = request.data
    user = User.objects.get(username=data['user'])
    place = Place.objects.get(id=data['place'])
    if user != auth_user:
        return Response(json.dumps({'error': 'Authentication error!'}))
    data = {
        'user': user.id,
        'place': place.id,
        'comment': data['comment']
    }
    serializer = CommentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        comment = Comments.objects.get(id=serializer.data.get('id'))
        image = ""
        if comment.user.traveler.image == "":
            image = "localhost:8000/static/images/default.png"
        else:
            image = "localhost:8000/travel"+comment.user.traveler.image.url,
        dic = {
            'id': comment.id,
            'comment': comment.comment,
            'user': str(comment.user),
            'username': comment.user.first_name + " " + comment.user.last_name,
            'image': image,
            'time': str(comment.time)
        }
        return Response(json.dumps(dic))

@api_view(['GET', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def CommentDelete(request):
    auth_user = request.user
    data = request.data
    user = User.objects.get(username=data['user'])
    if user != auth_user:
        return Response(json.dumps({'error': 'Authentication error!'}))
    comment = Comments.objects.get(id=data['id'])
    comment.delete()
    return Response({'delete': 'ok'})

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def CommentUpdate(request):
    auth_user = request.user
    data = request.data
    comment = Comments.objects.get(id=data['id'])
    auth_user = request.user
    data = request.data
    user = User.objects.get(username=data['user'])
    place = Place.objects.get(id=data['place'])
    if user != auth_user:
        return Response(json.dumps({'error': 'Authentication error!'}))
    data = {
        'user': user.id,
        'place': place.id,
        'comment': data['comment']
    }
    serializer = CommentSerializer(instance=comment, data=data)
    if serializer.is_valid():
        serializer.save()
        comment = Comments.objects.get(id=serializer.data.get('id'))
        image = ""
        if comment.user.traveler.image == "":
            image = "localhost:8000/static/images/default.png"
        else:
            image = "localhost:8000/travel"+comment.user.traveler.image.url,
        dic = {
            'id': comment.id,
            'comment': comment.comment,
            'user': str(comment.user),
            'username': comment.user.first_name + " " + comment.user.last_name,
            'image': image,
            'time': str(comment.time)
        }
        return Response(json.dumps(dic))
    return Response(json.dumps(data))

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profileUpdate(request):
    user = User.objects.get(username=request.data['user'])
    profile = user.traveler
    data = {
        'id': profile.id,
        'user': profile.user.id,
        'image': request.FILES['image']
    }
    serializer = ProfileSerializer(instance=profile, data=data)
    if serializer.is_valid():
        serializer.save()
        image = profile.image.url
        return Response(json.dumps({"image": image}))
    return Response(json.dumps({'error': 'upload error!'}))
