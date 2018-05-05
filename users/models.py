from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save

def avatar_location(instance, filename):
	return "avatar/%s/%s" % (instance.id, filename)

class userProfile(models.Model):
	user = models.OneToOneField(User)
	avatar = models.ImageField(upload_to=avatar_location, blank=True, null=True)
	twitter = models.TextField(blank=True, null=True)
	longitude = models.DecimalField(max_digits=9, decimal_places=6, default="0.0")
	latitude = models.DecimalField(max_digits=9, decimal_places=6, default="0.0")
	followers = models.TextField(blank=True, null=True)
	following = models.TextField(blank=True, null=True)
	
	class Meta:
		db_table = 'user_profile'
		app_label = 'users'

	def __str__(self):
		return "%s - lat: %s / lng: %s " % (self.user.username,str(self.longitude),str(self.latitude))

def create_user_profile(sender, instance, created, **kwargs):
	if created:
		userProfile.objects.create(user=instance)

post_save.connect(create_user_profile, sender=User)