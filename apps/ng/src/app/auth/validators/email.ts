import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
@Injectable({ providedIn: 'root' })
export class EmailExistsValidator implements AsyncValidator {
  constructor(private authService: AuthService) {}

  // async validator to test if an email exists in mongodb
  validate = async (
    control: AbstractControl
  ): Promise<ValidationErrors | null> => {
    return firstValueFrom(this.authService.isEmailExists(control.value)).then(
      (response) => {
        return response.exists ? { emailExists: true } : null;
      }
    );
  };
}
