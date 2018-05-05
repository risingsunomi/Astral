# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-25 23:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('msgs', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userpost',
            name='latitude',
            field=models.DecimalField(decimal_places=6, default='0.0', max_digits=9),
        ),
        migrations.AddField(
            model_name='userpost',
            name='longitude',
            field=models.DecimalField(decimal_places=6, default='0.0', max_digits=9),
        ),
        migrations.AlterField(
            model_name='userpost',
            name='reach',
            field=models.DecimalField(blank=True, decimal_places=4, max_digits=4, null=True),
        ),
    ]