from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

def mimg_location(instance, filename):
	return "msg_img/%s/%s" % (instance.id, filename)

def mvid_location(instance, filename):
	return "msg_vid/%s/%s" % (instance.id, filename)

def maudio_location(instance, filename):
	return "msg_audio/%s/%s" % (instance.id, filename)

# friends can see forever posts
# global can select time posts will be visible (168 hours max)
# rooms for chat
# motd pop-up option when entering chatrooms
class userPost(models.Model):
	user = models.ForeignKey(User)
	content = models.TextField()
	reach = models.DecimalField(max_digits=4, decimal_places=4, blank=True, null=True)
	longitude = models.DecimalField(max_digits=9, decimal_places=6, default="0.0")
	latitude = models.DecimalField(max_digits=9, decimal_places=6, default="0.0")
	image = models.ImageField(upload_to=mimg_location, blank=True, null=True)
	video = models.FileField(upload_to=mvid_location, blank=True, null=True)
	audio = models.FileField(upload_to=maudio_location, blank=True, null=True)
	created = models.DateTimeField(auto_now_add=True)
	modified = models.DateTimeField(auto_now=True)

	class Meta:
		db_table = 'user_post'
		app_label = 'msgs'

	def __str__(self):
		return "%s - %s" % (self.user.username,self.content)
