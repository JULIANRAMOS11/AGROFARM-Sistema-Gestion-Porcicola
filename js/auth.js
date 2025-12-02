<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AGROFARM - Iniciar Sesión</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" defer></script>
</head>
<body class="bg-gray-100 flex items-center justify-center h-screen bg-green-50">

    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-green-600">
        
        <div class="text-center mb-6">
            <img src="img/logo.jpeg" alt="Logo Agrofarm" class="mx-auto h-24 mb-2 rounded-full shadow-sm">
            <h1 class="text-2xl font-extrabold text-green-800 tracking-wide">AGROFARM</h1>
            <p class="text-gray-500 text-sm">Sistema de Gestión Porcícola</p>
        </div>

        <form id="loginForm" class="space-y-4">
            
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1" for="username">Usuario</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <i class="fas fa-user"></i>
                    </span>
                    <input id="username" type="text" class="pl-10 mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-green-500 focus:border-green-500 transition" placeholder="Ingrese su usuario" required />
                </div>
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1" for="password">Contraseña</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <i class="fas fa-lock"></i>
                    </span>
                    <input id="password" type="password" class="pl-10 mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-green-500 focus:border-green-500 transition" placeholder="Ingrese su contraseña" required />
                </div>
            </div>

            <button type="submit" class="w-full bg-green-700 text-white font-bold py-2.5 rounded-lg hover:bg-green-800 transition duration-300 shadow-md transform hover:-translate-y-0.5">
                Ingresar al Sistema
            </button>
        </form>

        <p class="mt-6 text-center text-sm text-gray-600">
            ¿No tienes cuenta? 
            <a href="register.html" class="text-green-700 font-bold hover:underline hover:text-green-900">Regístrate aquí</a>
        </p>
    </div>

    <script type="module" src="js/auth.js"></script>
</body>
</html>