import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class Utils {
  public bootstrapClasses = {
        popup: "card",
        cancelButton: "btn btn-danger",
        confirmButton: "btn btn-success",
        denyButton: "btn btn-secondary"
    }

    public showAlert(text: string) {
        Swal.fire({
            title: 'Error!',
            text: text,
            icon: 'error',
            confirmButtonText: 'Cool'
        })
    }
    
    public showRating(text: string) {
        Swal.fire({
            title: 'Awesome!',
            text: text,
            icon: 'success',
            confirmButtonText: 'Cool'
        })
    }

    public showDialog(title: string, callback: Function, cancel: string = "No", confirm: string = "Yes",) {
        Swal.fire({
            title: title,
            showCancelButton: true,
            confirmButtonText: confirm,
            cancelButtonText: cancel,
            customClass: this.bootstrapClasses
        }).then((result) => {
            if (result.isConfirmed && title === "Are you sure you want to log out?") {
                Swal.fire('Logout sucess!', '', 'success')
                
            }
            callback()
        })
    }
}
