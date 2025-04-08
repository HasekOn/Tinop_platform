<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
//--------------!!!! Potreba dodelat ENGLISH A ABILITIES K TOKENUM
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'password' => [
                    'required',
                    'confirmed',
                    Password::min(8)
                        ->mixedCase()
                        ->numbers()
                        ->symbols()
                ],
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Uživatel byl úspěšně zaregistrován',
                'data' => [
                    'user' => new UserResource($user),
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                ]
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validační chyba',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            Log::error('Chyba při registraci uživatele: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Při registraci došlo k chybě',
            ], 500);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'email' => ['required', 'string', 'email'],
                'password' => ['required', 'string'],
            ]);

            if (!Auth::attempt($validated)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Poskytnuté přihlašovací údaje jsou nesprávné',
                ], 401);
            }

            $user = User::where('email', $validated['email'])->firstOrFail();

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Uživatel byl úspěšně přihlášen',
                'data' => [
                    'user' => new UserResource($user),
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                ]
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validační chyba',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            Log::error('Chyba při přihlašování: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Při přihlášení došlo k chybě',
            ], 500);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Uživatel byl úspěšně odhlášen'
            ]);
        } catch (Exception $e) {
            Log::error('Chyba při odhlašování: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Při odhlášení došlo k chybě',
            ], 500);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function user(Request $request): JsonResponse
    {
        try {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'user' => new UserResource($request->user())
                ]
            ]);
        } catch (Exception $e) {
            Log::error('Chyba při načítání uživatelských dat: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Při načítání uživatelských dat došlo k chybě',
            ], 500);
        }
    }
}
