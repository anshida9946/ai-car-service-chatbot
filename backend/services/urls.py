from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_services),  # GET active

    path('admin/', views.get_all_services_admin),  # admin list

    path('add/', views.add_service),
    path('update/<int:pk>/', views.update_service),
    path('delete/<int:pk>/', views.delete_service),

    path('toggle-popular/<int:pk>/', views.toggle_popular),
]