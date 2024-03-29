from django.urls import reverse_lazy
from django.conf import settings
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.core.exceptions import ObjectDoesNotExist
import json

from .utility import (
  create_category, delete_images, create_place, create_user,
  create_image, get_traveler, pin_place, create_comment
)


class CategoryListTestCase(APITestCase):
  def setUp(self):
    self.url = reverse_lazy('category-list')

    self.category_1 = create_category(
      name='test_category_1',
      title='test_title_1',
      trending=True,
      image_name='test_image_1',
      image_extension='JPEG'
    )
    
    self.images = [
      self.category_1.image
    ]
  
  def test_category_list(self):
    response = self.client.get(self.url)
  
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertGreater(len(response.data), 0)

    self.assertEqual(
      response.data[0]['name'],
      self.category_1.name
    )
    self.assertEqual(
      response.data[0]['title'], 
      self.category_1.title
    )
    self.assertTrue(response.data[0]['trending'])

  def test_category_list_invalid_request_method(self):
    response = self.client.post(self.url)
    
    self.assertEqual(
      response.status_code, 
      status.HTTP_405_METHOD_NOT_ALLOWED
    )

  def tearDown(self):
    delete_images(self.images)


class CategoryPlaceTestCase(APITestCase):
  def setUp(self):
    self.category_1 = create_category(
      name='test_category_1',
      title='test_title_1',
      trending=True,
      image_name='test_image_1',
      image_extension='JPEG'
    )

    self.user_1 = create_user(username='test_user_1')
    self.user_2 = create_user(username='test_user_2')

    self.place_1 = create_place(
      category=self.category_1, title='test_title_1',
      image_name='test_image_1', image_extensiom='JPEG',
      description='test_description_1',
      love=[self.user_1, self.user_2]
    )
    
    self.images = [
      self.category_1.image,
      self.place_1.image
    ]

    self.url = reverse_lazy(
      'category-place',
      kwargs={'pk': self.category_1.id}
    )

  def test_category_place(self):
    response = self.client.get(self.url)
    
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertGreater(len(response.data), 0)
    self.assertEqual(response.data[0]['title'], self.place_1.title)
    self.assertEqual(response.data[0]['love'], [
      self.user_1.id, self.user_2.id
    ])

  def test_category_place_non_existing(self):
    url = reverse_lazy(
      'category-place',
      kwargs={'pk': 0}
    )

    response = self.client.get(url)

    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    self.assertIn('message', response.data)
    self.assertEqual(response.data['message'], 'Invalid category')
     
    
  def test_category_place_invalid_existing(self):
    url = reverse_lazy(
      'category-place',
      kwargs={'pk': 'invalid_id'}
    )
    with self.assertRaises(ValueError):
      self.client.get(url)

  def test_category_place_invalid_request_method(self):
    response = self.client.post(self.url)
    
    self.assertEqual(
      response.status_code, 
      status.HTTP_405_METHOD_NOT_ALLOWED
    )

  def tearDown(self):
    delete_images(self.images)


class CategoryNameTestCase(APITestCase):
  def setUp(self):
    self.category_1 = create_category(
      name='test_category_1',
      title='test_title_1',
      trending=True,
      image_name='test_image_1',
      image_extension='JPEG'
    )

    self.images = [
      self.category_1.image,
    ]

    self.url = reverse_lazy(
      'category-name',
      kwargs={'pk': self.category_1.id}
    )

  def test_category_name(self):
    response = self.client.get(self.url)
    
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertGreater(len(response.data), 0)
    self.assertEqual(list(response.data)[0], self.category_1.name)

  def test_category_name_non_existing(self):
    url = reverse_lazy(
      'category-name',
      kwargs={'pk': 0}
    ) 

    response = self.client.get(url)

    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    self.assertIn('message', response.data)
    self.assertEqual(response.data['message'], 'Invalid category')
    
  def test_category_name_invalid(self):
    url = reverse_lazy(
      'category-name',
      kwargs={'pk': 'invalid_id'}
    )

    with self.assertRaises(ValueError):
      self.client.get(url)      

  def test_category_name_invalid_request_method(self):
    response = self.client.post(self.url)
    
    self.assertEqual(
      response.status_code, 
      status.HTTP_405_METHOD_NOT_ALLOWED
    )

  def tearDown(self):
    delete_images(self.images)


class UserRegistrationTestCase(APITestCase):
  def setUp(self):
    self.url = reverse_lazy('user-register')
    self.payload = {
      'email': 'test@example.com',
      'first_name': 'test_first_name',
      'last_name': 'test_last_name',
      'username': 'test_user',
      'password': 'password123',
    }
    
  def test_user_registration(self):
    response = self.client.post(self.url, self.payload)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertIn('email', response.data)
    self.assertEqual(response.data['email'][0], self.payload['email'])

  def test_user_registration_empty_required_fields(self):
    invalid_payload = {
      'email': 'test@example.com',
      'last_name': 'test_last_name',
      'password': 'password123',
    }

    response = self.client.post(self.url, invalid_payload)

    self.assertEqual(response.data['username'][0], 'This field is required.')
    self.assertEqual(response.data['first_name'][0], 'This field is required.')
    self.assertEqual(response.status_code, status.HTTP_200_OK)

  def test_user_registration_invalid_credential(self):
    invalid_payload = {
      'email': 'testexample.com', 
      'first_name': 'test_first_name',
      'last_name': 'test_last_name',
      'username': 'test_user',
      'password': 'password123',
    }

    response = self.client.post(self.url, invalid_payload)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.data['email'][0], 'Enter a valid email address.')
    self.assertEqual(response.data['email'][0].code, 'invalid')

  def test_user_registration_invalid_fields(self):
    invalid_payload = {
      'email': 'test@example.com',
      'first_name': 'test_first_name',
      'last_name': 'test_last_name',
      'username': 'test_user',
      'password': 'password123',
      'admin': True
    }

    response = self.client.post(self.url, invalid_payload)
    
    self.assertEqual(response.data['email'][0], invalid_payload['email'])
    self.assertEqual(response.status_code, status.HTTP_200_OK)
  
  def test_user_registration_invalid_request_method(self):
    response = self.client.get(self.url, self.payload)
    
    self.assertEqual(
      response.status_code, 
      status.HTTP_405_METHOD_NOT_ALLOWED
    )


class UserLoginTestCase(APITestCase):
  def setUp(self):
    self.url = reverse_lazy('user-login')
    self.user = create_user(
      username='test_username',
      password='test_password'
    )

    self.token = Token.objects.create(user=self.user)

    self.payload = {
      'username': self.user.username,
      'password': 'test_password',
    }
    
  def test_user_login(self):
    response = self.client.post(self.url, self.payload)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertIn('token', response.data)
    self.assertEqual(response.data['token'], self.token.key)

  def test_user_login_invalid_credential(self):
    invalid_credentials = {
      'username': self.user.username,
      'password': 'invalid_test_password',
    }
    response = self.client.post(self.url, invalid_credentials)

    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(
      response.data['non_field_errors'][0], 
      'Unable to log in with provided credentials.'
    )
    self.assertEqual(
      response.data['non_field_errors'][0].code, 
      'authorization'
    )

  def test_user_login_invalid_field(self):
    invalid_payload = {
      'user': self.user.username,
      'pass': 'test_password',
    }
    response = self.client.post(self.url, invalid_payload)
    
    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(response.data['username'][0], 'This field is required.')
    self.assertEqual(response.data['password'][0], 'This field is required.')
    self.assertEqual(response.data['username'][0].code, 'required')
    self.assertEqual(response.data['password'][0].code, 'required')

  def test_user_login_invalid_request_method(self):
    response = self.client.get(self.url, self.payload)
    
    self.assertEqual(
      response.status_code, 
      status.HTTP_405_METHOD_NOT_ALLOWED
    )


class PlaceDetailsTestCase(APITestCase):
  def setUp(self):
    self.place = create_place(
      title='test_title',
      image_name='test_image',
      image_extensiom='JPEG',
      description='test_description'
    )

    self.images = [
      self.place.image
    ]

    self.url = reverse_lazy('place', kwargs={'pk': self.place.id})

  def test_place_details(self):
    response = self.client.get(self.url)
    
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.data['title'], self.place.title)
    self.assertEqual(response.data['description'], self.place.description)
    self.assertEqual(response.data['category'], self.place.category.id)
    self.assertTrue(len(response.data['love']) == 0)

  def test_place_details_non_existing(self):
    url = reverse_lazy('place', kwargs={'pk': 0})
    response = self.client.get(url)

    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    self.assertEqual(response.data['message'], 'Invalid place')

  def test_place_details_invalid(self):
    url = reverse_lazy('place', kwargs={'pk': 'invalid id'})
    with self.assertRaises(ValueError):
      self.client.get(url)

  def test_place_details_invalid_request_method(self):
    response = self.client.post(self.url)
    
    self.assertEqual(
      response.status_code, 
      status.HTTP_405_METHOD_NOT_ALLOWED
    )

  def tearDown(self):
    delete_images(self.images)


class UserProfileTestCase(APITestCase):
  def setUp(self):
    self.user = create_user(
      username='test_user',
      password='test_password'
    )

    self.traveler = get_traveler(user=self.user)
    
    self.url = reverse_lazy(
      'user-profile', 
      kwargs={'username': self.user.username}
    )

  def test_user_profile(self):
    response = self.client.get(self.url)
    image = settings.MEDIA_URL + self.traveler.image.name

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.data['user'], self.user.id)
    self.assertEqual(response.data['image'], image)

  def test_user_profile_non_existing(self):
    url = reverse_lazy('user-profile', kwargs={'username': 'non-existing'})
    response = self.client.get(url)
    
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    self.assertEqual(response.data['message'], 'User doesn\'t exists')

  def test_user_profile_invalid_request_method(self):
    response = self.client.post(self.url)

    self.assertEqual(
      response.status_code,
      status.HTTP_405_METHOD_NOT_ALLOWED
    )

  
class UserDetailsTestCase(APITestCase):
  def setUp(self):
    self.user = create_user(
      username='test_user',
      password='test_password',
      email='test_email_details@fakemail.com'
    )

    self.traveler = get_traveler(user=self.user)
    
    self.url = reverse_lazy(
      'user-detail', 
      kwargs={'username': self.user.username}
    )
  
  def test_user_details(self):
    response = self.client.get(self.url)
    
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.data['email'], self.user.email)


  def test_user_details_non_existing(self):
    url = reverse_lazy('user-detail', kwargs={'username': 'non-existing'})
    response = self.client.get(url)
    
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    self.assertEqual(response.data['message'], 'User doesn\'t exists')

  def test_user_details_invalid_request_method(self):
    response = self.client.post(self.url)

    self.assertEqual(
      response.status_code,
      status.HTTP_405_METHOD_NOT_ALLOWED
    )

class UserPinPlaceTestCase(APITestCase):
  def setUp(self):
    self.user = create_user(
      username='test_username',
      password='test_password'
    )

    self.token = Token.objects.create(user=self.user)
    
    self.url = reverse_lazy(
      'user-pin-place', 
      kwargs={
        'token': self.token.key
      }
    )

    self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    self.place_1 = create_place(title='test_place_1')
    self.place_2 = create_place(title='test_place_2')

    self.pin_place_1 = pin_place(user=self.user, place=self.place_1)
    self.pin_place_2 = pin_place(user=self.user, place=self.place_2)

    self.images = [
      self.place_1.image,
      self.place_2.image
    ]

  def test_user_pin_place(self):
    response = self.client.get(self.url)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertGreater(len(response.data), 0)
    self.assertEqual(response.data[0]['title'], self.place_1.title)
    self.assertEqual(response.data[1]['title'], self.place_2.title)

  
  def test_user_pin_place_unauthorized(self):
    self.client.credentials(HTTP_AUTHORIZATION='')
    response = self.client.get(self.url)
    self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

  def test_user_pin_place_invalid_token(self):
    user = create_user(username='test_user_2')
    token = Token.objects.create(user=user)

    self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
  
    response = self.client.get(self.url)
    self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    self.assertEqual(response.data['message'], 'Invalid token')
    
  def tearDown(self):
    delete_images(self.images)


class PinCheckTestCase(APITestCase):
  def setUp(self):
    self.user = create_user(
      username='test_username',
      password='test_password'
    )

    self.token = Token.objects.create(user=self.user)
    
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    self.place_1 = create_place(title='test_place_1')
    self.place_2 = create_place(title='test_place_2')

    self.pin_place_1 = pin_place(user=self.user, place=self.place_1)

    self.url_pinned = reverse_lazy(
      'pin-check', 
      kwargs={
        'pk': self.place_1.id,
        'username': self.user.username
      }
    )
    
    self.url_unpinned = reverse_lazy(
      'pin-check', 
      kwargs={
        'pk': self.place_2.id,
        'username': self.user.username
      }
    )

    self.images = [
      self.place_1.image,
      self.place_2.image
    ]

  def test_pin_check_pinned(self):
    response = self.client.get(self.url_pinned)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertTrue(response.data['pinned'])

  def test_pin_check_unpinned(self):
    response = self.client.get(self.url_unpinned)
    
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertFalse(response.data['pinned'])

  def test_pin_check_unauthorized(self):
    self.client.credentials(HTTP_AUTHORIZATION='')
    response = self.client.get(self.url_pinned)
    
    self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

  def test_pin_check_invalid_token(self):
    user = create_user(username='test_user_2')
    token = Token.objects.create(user=user)

    self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = self.client.get(self.url_pinned)
    
    self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    self.assertEqual(response.data['message'], 'Invalid user')

  def tearDown(self):
    delete_images(self.images)


class PinSwapTestCase(APITestCase):
  def setUp(self):
    self.user = create_user(
      username='test_username',
      password='test_password'
    )

    self.token = Token.objects.create(user=self.user)
    
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    self.place_1 = create_place(title='test_place_1')
    self.place_2 = create_place(title='test_place_2')

    self.pin_place_1 = pin_place(user=self.user, place=self.place_1)

    self.url_pinned = reverse_lazy(
      'pin-swap', 
      kwargs={
        'pk': self.place_1.id,
        'username': self.user.username
      }
    )
    
    self.url_unpinned = reverse_lazy(
      'pin-swap', 
      kwargs={
        'pk': self.place_2.id,
        'username': self.user.username
      }
    )

    self.images = [
      self.place_1.image,
      self.place_2.image
    ]

  def test_pin_swap_pinned(self):
    response = self.client.get(self.url_pinned)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertFalse(response.data['pinned'])

  def test_pin_swap_unpinned(self):
    response = self.client.get(self.url_unpinned)
    
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertTrue(response.data['pinned'])

  def test_pin_swap_unauthorized(self):
    self.client.credentials(HTTP_AUTHORIZATION='')
    response = self.client.get(self.url_pinned)
    
    self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

  def test_pin_swap_invalid_token(self):
    user = create_user(username='test_user_2')
    token = Token.objects.create(user=user)

    self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = self.client.get(self.url_pinned)
    
    self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    self.assertEqual(response.data['message'], 'Invalid user')

  def tearDown(self):
    delete_images(self.images) 


class LoveCheckTestCase(APITestCase):
  def setUp(self):
    self.user = create_user(
      username='test_username',
      password='test_password'
    )

    self.place_1 = create_place(title='test_place_1', love=[self.user.id])
    self.place_2 = create_place(title='test_place_2', love=[])

    self.url_loved = reverse_lazy(
      'love-check', 
      kwargs={
        'pk': self.place_1.id,
        'username': self.user.username
      }
    )
    
    self.url_not_loved = reverse_lazy(
      'love-check', 
      kwargs={
        'pk': self.place_2.id,
        'username': self.user.username
      }
    )

    self.images = [
      self.place_1.image,
      self.place_2.image
    ]

  def test_love_check_loved(self):
    response = self.client.get(self.url_loved)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertTrue(response.data['loved'])

  def test_love_check_unloved(self):
    response = self.client.get(self.url_not_loved)
    
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertFalse(response.data['loved'])

  def tearDown(self):
    delete_images(self.images)


class LoveSwapTestCase(APITestCase):
  def setUp(self):
    self.user = create_user(
      username='test_username',
      password='test_password'
    )

    self.token = Token.objects.create(user=self.user)
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    self.place_1 = create_place(title='test_place_1', love=[self.user.id])
    self.place_2 = create_place(title='test_place_2', love=[])

    self.url_loved = reverse_lazy(
      'love-swap', 
      kwargs={
        'pk': self.place_1.id,
        'username': self.user.username
      }
    )
    
    self.url_not_loved = reverse_lazy(      
      'love-swap', 
      kwargs={
        'pk': self.place_2.id,
        'username': self.user.username
      }
    )

    self.images = [
      self.place_1.image,
      self.place_2.image
    ]

  def test_love_swap_loved(self):
    response = self.client.get(self.url_loved)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertFalse(response.data['loved'])

  def test_love_swap_loved(self):
    response = self.client.get(self.url_not_loved)
    
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertTrue(response.data['loved'])

  def test_love_swap_unauthorized(self):
    self.client.credentials(HTTP_AUTHORIZATION='')
    response = self.client.get(self.url_loved)
    
    self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

  def test_love_swap_invalid_token(self):
    user = create_user(username='test_user_2')
    token = Token.objects.create(user=user)

    self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = self.client.get(self.url_loved)
    
    self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    self.assertEqual(response.data['message'], 'Invalid user')

  def tearDown(self):
    delete_images(self.images)
    


class PlaceCommentsTestCase(APITestCase):
  def setUp(self):
    self.user = create_user(
      username='test_username',
      password='test_password'
    )

    self.token = Token.objects.create(user=self.user)
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    self.place_1 = create_place(title='test_place_1')
    self.comment_1 = create_comment(
      place=self.place_1, 
      user=self.user,
      comment='test_comment_1'
    )

    self.url = reverse_lazy(
      'place-comments', 
      kwargs={
        'pk': self.place_1.id,
        'start': 0,
        'end': 10
      }
    )

    self.images = [
      self.place_1.image,
    ]

  def test_place_comments(self):
    response = self.client.get(self.url)
    
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    response_data = json.loads(response.data)
    self.assertIsNotNone(response_data[0][0])
    self.assertEqual(response_data[0][0]['comment'], self.comment_1.comment)

  def test_place_comments_non_existing_place(self):
    url = reverse_lazy(
      'place-comments', 
      kwargs={
        'pk': 0,
        'start': 0,
        'end': 10
      }
    )
    response = self.client.get(url)
    
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    self.assertEqual(response.data['message'], 'Invalid place')

  def test_place_comments_invalid_place(self):
    url = reverse_lazy(
      'place-comments', 
      kwargs={
        'pk': 'invalid',
        'start': 0,
        'end': 10
      }
    )
    with self.assertRaises(ValueError):
      self.client.get(url)

  def test_place_comments_unauthorized(self):
    self.client.credentials(HTTP_AUTHORIZATION='')
    response = self.client.get(self.url)
    self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

  def tearDown(self):
    delete_images(self.images)


