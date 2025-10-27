<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App as AppFacade;

class LocaleFromQuery
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $lang = $request->query('lang');

        if (in_array($lang, ['en', 'fr'], true)) {
            AppFacade::setLocale($lang);
        }

        return $next($request);
    }
}


