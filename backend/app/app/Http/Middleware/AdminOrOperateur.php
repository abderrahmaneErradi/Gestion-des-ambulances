<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminOrOperateur
{
    /**
     * Gère une requête entrante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Si l'utilisateur n'est pas connecté ou n'a pas le rôle admin/operateur
        if (!$user || !$user->isAdminOrOperateur()) {
            return response()->json([
                'status' => false,
                'message' => "Accès refusé. Seuls les administrateurs ou opérateurs sont autorisés."
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
