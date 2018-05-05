from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_http_methods
from django.contrib.auth import logout, authenticate, login
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from msgs.models import userPost
from users.models import userProfile
from django.contrib.auth.models import User
from HTMLParser import HTMLParser

class MLStripper(HTMLParser):
	def __init__(self):
		self.reset()
		self.fed = []
	def handle_data(self, d):
		self.fed.append(d)
	def get_data(self):
		return ''.join(self.fed)

def strip_tags(html):
	s = MLStripper()
	s.feed(html)
	return s.get_data()


@csrf_protect
@require_http_methods(["GET",])
def wallMap(request):
	if request.user.is_authenticated():
		return render(request, 'msgs/wall_map.html')
	else:
		return redirect("/")


@csrf_protect
@require_http_methods(["POST",])
def createPost(request):
	response_data = {}
	if request.user.is_authenticated():
		contt = strip_tags(request.POST["content"])

		if contt and contt.strip() != "":
			try:
				upf = userProfile.objects.get(user=request.user)
			except ObjectDoesNotExist:
				upf = None

			if upf:
				upobj = userPost(user=request.user)
				upobj.content = contt
				upobj.latitude = upf.latitude
				upobj.longitude = upf.longitude

				upobj.save()

				response_data["msg"] = "Message Posted @ longitude "+str(upf.longitude)+" latitude "+str(upf.latitude)
				return JsonResponse(response_data)
			else:
				response_data["msg"] = "Error: User profile information not found. Please contact support. ERROR CODE: 0105"
				return JsonResponse(response_data)
		else:
			response_data["msg"] = "Error: Please enter a message."
			return JsonResponse(response_data)
	else:
		return JsonResponse(response_data)

@csrf_protect
@require_http_methods(["POST",])
def getAllPosts(request):
	response_data = {}
	if request.user.is_authenticated():
		upobj = userPost.objects.filter().order_by('modified').values().exclude(user=User.objects.get(id=17))
		if len(upobj) > 0:
			message_list = []
			for messg in upobj:
				try:
					tmsg = {
						"id": str(messg["id"]),
						"user": User.objects.get(id=messg["user_id"]).username,
						"content": messg["content"],
						"longitude": messg["longitude"],
						"latitude": messg["latitude"],
						"created": str(messg["created"])
					}
				except ObjectDoesNotExist:
					tmsg = {
						"id": str(messg["id"]),
						"user": "unknown",
						"content": messg["content"],
						"longitude": messg["longitude"],
						"latitude": messg["latitude"],
						"created": str(messg["created"])
					}

				message_list.append(tmsg)
				del tmsg

			response_data["posts"] = message_list
			response_data["msg"] = "Posts found"
			return JsonResponse(response_data)
		else:
			response_data["msg"] = "No posts found"
			return JsonResponse(response_data)

	else:
		return JsonResponse(response_data)


@csrf_protect
@require_http_methods(["GET",])
def watchMap(request):
	if request.user.is_authenticated():
		return render(request, 'msgs/watch_map.html')
	else:
		return redirect("/")

@csrf_protect
@require_http_methods(["POST",])
def getTwPosts(request):
	response_data = {}
	if request.user.is_authenticated():
		upobj = userPost.objects.filter(user=User.objects.get(id=17)).order_by('modified').values()
		if len(upobj) > 0:
			message_list = []
			for messg in upobj:
				try:
					tmsg = {
						"id": str(messg["id"]),
						"user": User.objects.get(id=messg["user_id"]).username,
						"content": messg["content"],
						"longitude": messg["longitude"],
						"latitude": messg["latitude"],
						"created": str(messg["created"])
					}
				except ObjectDoesNotExist:
					tmsg = {
						"id": str(messg["id"]),
						"user": "unknown",
						"content": messg["content"],
						"longitude": messg["longitude"],
						"latitude": messg["latitude"],
						"created": str(messg["created"])
					}

				message_list.append(tmsg)
				del tmsg

			response_data["posts"] = message_list
			response_data["msg"] = "Posts found"
			return JsonResponse(response_data)
		else:
			response_data["msg"] = "No posts found"
			return JsonResponse(response_data)

	else:
		return JsonResponse(response_data)