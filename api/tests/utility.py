from api.models import *
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image
import os

def create_image(name='test_image.jpg', image_extension='JPEG'):
  img_name = name
  img = Image.new('RGB', (100, 100))
  img_io = BytesIO()
  img.save(img_io, image_extension)
  image = SimpleUploadedFile(
    img_name, img_io.getvalue(), 
    content_type='image/jpeg'
  )
  return image


def delete_images(images):
  for image in images:
    if os.path.exists(image.path):
      os.remove(image.path)


def create_category(
    name='test_categroy', title='test_title',
    trending=True, image_name='test_image',
    image_extension='JPEG'
  ):

  image = create_image(
    name=image_name, 
    image_extension=image_extension
  )

  category = Category.objects.create(
    name=name,
    title=title,
    trending=trending,
    image=image
  )

  return category


def create_user(username='test_user', password='test_password'):
  return User.objects.create(
    username=username,
    password=make_password(password)
  )


def create_place(
    category=None, title='test_title',
    image_name='test_image', image_extensiom='JPEG',
    description='test_description', love=[]
  ):

  if category is None:
    category = create_category(
      image_name=image_name,
      image_extension=image_extensiom
    )
  
  place = Place.objects.create(
    category=category,
    title=title,
    image=category.image,
    description=description
  )
  place.love.set(love)

  return place