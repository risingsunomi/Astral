from django.conf.urls import url
from msgs import views

urlpatterns = [
	url(r'^$', views.wallMap, name='wallMap'),
	url(r'^enchant/', views.createPost, name='create_post'),
	url(r'^summon/', views.getAllPosts, name='get_all_posts'),
	url(r'^phoenix/', views.getTwPosts, name='get_twitter_posts'),
	url(r'^prodrome/', views.watchMap, name='watchMap'),
]