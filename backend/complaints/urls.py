from django.urls import path
from .views import (
    create_complaint,
    my_complaints,
    delete_complaint,
    all_complaints,
    update_complaint_status,
    respond_complaint,
)

urlpatterns = [
    path('create/',                    create_complaint),         # POST  — user submits
    path('my/',                        my_complaints),            # GET   — user sees their own
    path('delete/<int:id>/',           delete_complaint),         # DELETE — user deletes
    path('all/',                       all_complaints),           # GET   — admin sees all
    path('status/<int:id>/',           update_complaint_status),  # PUT   — admin marks In Review
    path('respond/<int:id>/',          respond_complaint),        # PUT   — admin sends response + resolves
]