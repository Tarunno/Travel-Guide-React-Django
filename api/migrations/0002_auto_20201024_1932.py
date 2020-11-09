# Generated by Django 3.1.1 on 2020-10-24 13:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='title',
            field=models.CharField(max_length=300, null=True),
        ),
        migrations.AddField(
            model_name='category',
            name='trending',
            field=models.BooleanField(default=False, null=True),
        ),
    ]
