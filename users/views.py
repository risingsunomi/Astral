from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_http_methods
from django.contrib.auth import logout, authenticate, login
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from users.models import userProfile
from django.core.mail import send_mail

@csrf_protect
@require_http_methods(["GET", "POST"])
def userFP(request):
	if request.method == "GET":
		if request.user.is_authenticated():
			return redirect('/msgs/')
		else:
			return render(request, 'users/login.html')
	elif request.method == "POST":
		username = request.POST['username']
		password = request.POST['password']
		user = authenticate(username=username, password=password)
		if user is not None:
			if user.is_active:
				login(request, user)
				return redirect('/msgs/')
			else:
				return render(request, 'users/login.html', {"ferror": "Error Logging In. Please contact support if error is presistant. ERROR CODE: 0023"})
		else:
			return render(request, 'users/login.html', {"ferror": "Error Logging In. Please contact support if error is presistant. ERROR CODE: 0032"})

@csrf_protect
@require_http_methods(["GET",])
def userLogout(request):
	logout(request)
	return redirect("/")

@csrf_protect
@require_http_methods(["GET", "POST"])
def userRegister(request):
	if request.method == "GET":
		if request.user.is_authenticated():
			return redirect('/msgs/')
		else:
			return render(request, 'users/register.html')
	elif request.method == "POST":
		username = request.POST['username']
		email = request.POST['email']

		try:
			chkuser = User.objects.get(email=email)
			usemail = True
		except ObjectDoesNotExist:
			usemail = False

		try:
			chkun = User.objects.get(username=username)
			usen = True
		except ObjectDoesNotExist:
			usen = False

		if request.POST['password'] == request.POST['cpassword'] and usen == False and usemail == False:
			password = request.POST['password']
			new_user = User.objects.create_user(username, email, password)
			new_user.save()

			# send_mail(
			# 	'New User Registered!',
			# 	'New User '+username+' / '+email+' registered!',
			# 	'contact@nosudo.co',
			# 	['vincentcastro@gmail.com'],
			# 	fail_silently=False,
			# )
			
			return render(request, 'users/register.html', {"fsuccess": "Registering Successful."})
		elif usen or usemail:
			return render(request, 'users/register.html', {"ferror": "Error Registering. Credentials already connected"})
		else:
			return render(request, 'users/register.html', {"ferror": "Error Registering. Please check your passwords match."})

# Set/Update user's current location
@csrf_protect
@require_http_methods(["POST",])
def locSet(request):
	response_data = {}
	if request.user.is_authenticated():
		lat = float("%.6f" % float(request.POST['lat']))
		lng = float("%.6f" % float(request.POST['lng']))
		
		try:
			uprofile = userProfile.objects.get(user=request.user)
		except ObjectDoesNotExist:
			uprofile = None

		if uprofile:
			if float(uprofile.longitude) != lng and float(uprofile.latitude) != lat:
				uprofile.longitude = lng
				uprofile.latitude = lat
				uprofile.save()
				response_data["msg"] = "Success: User location updated."
			else:
				response_data["msg"] = "Success: User location alredy set to longitude "+str(lng)+" and latitude "+str(lat)+"."
			return JsonResponse(response_data)
		else:
			response_data["msg"] = "Error: User profile information not found. Please contact support. ERROR CODE: 0105"
			return JsonResponse(response_data)
	else:
		return JsonResponse(response_data)