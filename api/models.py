from django.db import models
from PIL import Image
from ckeditor.fields import RichTextField
from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class Category(models.Model):
    name = models.CharField(max_length=100, null=True, blank=False)
    title = models.CharField(max_length=300, null=True, blank=False)
    trending = models.BooleanField(default=False, null=True)
    image = models.ImageField(null=True, blank=True, upload_to='category/')

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super(Category, self).save(*args, **kwargs)

        img = Image.open(self.image.path)

        if img.height > 1000 or img.width > 1000:
            output_size = (1000, 1000)
            img.thumbnail(output_size)
            img.save(self.image.path)

class Place(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=False)
    title = models.CharField(max_length=300, null=True, blank=False)
    image = models.ImageField(null=True, blank=True, upload_to='places/')
    description =  RichTextField(null=True, blank=False)
    love = models.ManyToManyField(User, null=True, blank=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        super(Place, self).save(*args, **kwargs)

        img = Image.open(self.image.path)

        if img.height > 1000 or img.width > 1000:
            output_size = (1000, 1000)
            img.thumbnail(output_size)
            img.save(self.image.path)

class Traveler(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=False)
    image = models.ImageField(null=True, blank=True, upload_to="traveler/")

    def __str__(self):
        return self.user.username

    def save(self, *args, **kwargs):
        super(Traveler, self).save(*args, **kwargs)

        img = Image.open(self.image.path)

        if img.height > 700 or img.width > 700:
            output_size = (700, 700)
            img.thumbnail(output_size)
            img.save(self.image.path)

class PinPlace(models.Model):
    place = models.ForeignKey(Place, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.place.title[:20]+ " | "+self.user.username

class Comments(models.Model):
    place = models.ForeignKey(Place, on_delete=models.CASCADE, null=True, blank=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=False)
    comment = models.CharField(max_length=400, null=True, blank=False)
    time = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.comment[:20] + " | " +self.user.username+ " | "+self.place.title[:20]
