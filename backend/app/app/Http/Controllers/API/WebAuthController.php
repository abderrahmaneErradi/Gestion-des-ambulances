<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class WebAuthController extends Controller
{
    /**
     * Authentifie un utilisateur de type admin ou operateur et génère un token d'accès.
     *
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        // 1. Vérification des identifiants (existence et mot de passe)
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => "Identifiants de connexion incorrects."
            ], Response::HTTP_UNAUTHORIZED);
        }

        // 2. Vérification stricte du rôle
        if (!$user->isAdminOrOperateur()) {
            return response()->json([
                'status' => false,
                'message' => "Accès non autorisé. Seuls les administrateurs et régulateurs peuvent se connecter à cette interface."
            ], Response::HTTP_FORBIDDEN);
        }

        // 3. Génération du jeton (token) d'accès
        $token = $user->createToken('web_dashboard_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => "Authentification réussie.",
            'data' => [
                'token' => $token,
                'user' => [
                    'id_user' => $user->id_user,
                    'nom' => $user->nom,
                    'email' => $user->email,
                    'role' => $user->role,
                ]
            ]
        ], Response::HTTP_OK);
    }

    /**
     * Déconnecte l'utilisateur actuel en révoquant son token.
     *
     * @return JsonResponse
     */
    public function logout(): JsonResponse
    {
        // Révocation du token d'accès courant
        auth()->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => true,
            'message' => "Déconnexion réussie avec succès."
        ], Response::HTTP_OK);
    }
}
