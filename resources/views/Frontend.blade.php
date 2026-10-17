<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Website') }}</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/frontend/main.jsx'])
</head>
<body>
    <div id="frontend-root"></div>
</body>
</html>
