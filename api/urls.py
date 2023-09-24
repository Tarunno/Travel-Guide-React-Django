from django.urls import path
from .import views

from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views

from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [

    path('', views.ApiOverView, name='overview'),
    path('category-list/', views.CategoryList, name="category-list"),
    path('category/<str:pk>', views.CategoryName, name="category-name"),
    path('category-place/<str:pk>', views.CategoryPlace, name="category-place"),
    path('place/<str:pk>', views.PlaceDetails, name="place"),
    path('user-register/', views.UserRegistration, name="user-register"),
    path('user-login/', obtain_auth_token, name="user-login"),
    path('user-profile/<str:username>', views.UserProfile, name="user-profile"),
    path('user-details/<str:username>', views.UserDetail, name="user-detail"),
    path('user-pin-place/<str:token>', views.UserPinPlace, name="user-pin-place"),
    path('pin-check/<str:pk>/<str:username>', views.PinCheck, name="pin-check"),
    path('pin-swap/<str:pk>/<str:username>', views.PinSwap, name="pin-swap"),
    path('love-check/<str:pk>/<str:username>', views.LoveCheck, name="love-check"),
    path('love-swap/<str:pk>/<str:username>', views.LoveSwap, name="love-sawp"),
    path('comments/<str:pk>/<str:start>/<str:end>', views.PlaceComments, name="place-comments"),
    path('comment-add/', views.CommentAdd, name="comment-add"),
    path('comment-delete/', views.CommentDelete, name="comment-delete"),
    path('comment-update/', views.CommentUpdate, name="comment-update"),
    path('profile-photo/', views.profileUpdate, name="profile-update")

]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)