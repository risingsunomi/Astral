# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-25 23:14
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('msgs', '0002_auto_20160625_2302'),
    ]

    operations = [
        migrations.AddField(
            model_name='userpost',
            name='created',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2016, 6, 25, 23, 14, 39, 32864, tzinfo=utc)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userpost',
            name='modified',
            field=models.DateTimeField(auto_now=True, default=datetime.datetime(2016, 6, 25, 23, 14, 47, 429655, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
