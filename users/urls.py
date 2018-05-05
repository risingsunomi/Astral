from django.conf.urls import url
from users import views

urlpatterns = [
	url(r'^$', views.userFP, name='userFP'),
	url(r'^logout/', views.userLogout, name='userLogout'),
	url(r'^register/', views.userRegister, name='userRegister'),
	url(r'^user/locset/', views.locSet, name='user_locSet'),
]