<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class ApiExceptionListener
{
    public function onKernelException(ExceptionEvent $event): void
    {   
    
        $request = $event->getRequest();

        if (!str_starts_with($request->getPathInfo(), '/api')) {
            return;
        }

        $exception = $event->getThrowable();
        $status = 500;
        $error = 'Erreur interne';
        $message = 'Une erreur inattendue est survenue.';

        switch (true) {
            case $exception instanceof NotFoundHttpException:
                $status = 404;
                $error = 'Route non trouvée';
                $message = 'La ressource demandée n’existe pas.';
                break;

            case $exception instanceof MethodNotAllowedHttpException:
                $status = 405;
                $error = 'Méthode non autorisée';
                $message = 'La méthode HTTP utilisée n’est pas autorisée pour cette route ou la route n\'existe pas.';
                break;

            case $exception instanceof BadRequestHttpException:
                $status = 400;
                $error = 'Requête invalide';
                $message = $exception->getMessage() ?: 'La requête est malformée ou incomplète.';
                break;

            case $exception instanceof AccessDeniedHttpException:
                $status = 403;
                $error = 'Accès interdit';
                $message = 'Vous n’avez pas les droits nécessaires pour accéder à cette ressource.';
                break;

            case $exception instanceof AuthenticationException:
                $status = 401;
                $error = 'Non authentifié';
                $message = 'Vous devez être authentifié pour accéder à cette ressource.';
                break;

            case $exception instanceof HttpExceptionInterface:
                // Cas générique d'exception HTTP Symfony
                $status = $exception->getStatusCode();
                $error = 'Erreur HTTP';
                $message = $exception->getMessage();
                break;

            default:
                // Autres exceptions inattendues (erreurs de code, etc.)
                if ($_ENV['APP_ENV'] !== 'prod') {
                    $message = $exception->getMessage();
                }
                break;
        }

        $response = new JsonResponse([
            'status' => $status,
            'error' => $error,
            'message' => $message,
        ], $status);

        $event->setResponse($response);
    }
}