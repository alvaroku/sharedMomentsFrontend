import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../pages/auth/services/auth.service';
import { ResultPattern } from '../models/result-pattern.model';
import { MessageService } from 'primeng/api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Aquí asumimos que AuthService está disponible en el contexto de la aplicación
  const authService = inject(AuthService);
  const message = inject(MessageService);
  return authService.getCurrentUserState.pipe(
    take(1),
    switchMap(user => {
      let authReq = req;
      if (user && user.token) {
        authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${user.token}`
          }
        });
      }

      return next(authReq).pipe(
        catchError((error) => {
          switch (error.status) {
            case 0:
              message.add({ severity: 'error', summary: 'Error', detail: "No se pudo conectar al servidor" });
              break;
            case 401:
              authService.logout();
              handleError(message,error);
              break;
            case 404:
            case 500:
            case 403:
            case 405:
            case 422:
            case 409:
            case 400:
            default:
              handleError(message,error);
              break;
          }
          return throwError(error);
        }),
        finalize(() => {})
      );
    })
  );
};


function handleError(message:MessageService,error:any) {
  let finalMessage:string = ""
  if(error.error.message){//error controlado del pattern result
    finalMessage = error.error.message
  }else if(error.error.traceId){//error de .net por no enviar algún campo requerido
    for (const key in error.error.errors) {
      if (error.error.errors.hasOwnProperty(key)) {
        // Obtén la lista de mensajes para la clave actual
        const mensajes = error.error.errors[key];
        // Recorre cada mensaje
        mensajes.forEach((mensaje: string) => {
          finalMessage += mensaje + "\n";
        });
      }
    }
  }else{
    finalMessage = error
  }
  message.add({ severity: 'error', summary: 'Error', detail: finalMessage });
}
