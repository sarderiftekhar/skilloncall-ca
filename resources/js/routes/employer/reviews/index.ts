import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::index
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:25
 * @route '/employer/reviews'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employer/reviews',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::index
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:25
 * @route '/employer/reviews'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::index
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:25
 * @route '/employer/reviews'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::index
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:25
 * @route '/employer/reviews'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::create
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:41
 * @route '/employer/applications/{application}/reviews/create'
 */
export const create = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/employer/applications/{application}/reviews/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::create
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:41
 * @route '/employer/applications/{application}/reviews/create'
 */
create.url = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { application: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: typeof args.application === 'object'
                ? args.application.id
                : args.application,
                }

    return create.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::create
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:41
 * @route '/employer/applications/{application}/reviews/create'
 */
create.get = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::create
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:41
 * @route '/employer/applications/{application}/reviews/create'
 */
create.head = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::store
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:61
 * @route '/employer/reviews'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employer/reviews',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::store
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:61
 * @route '/employer/reviews'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::store
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:61
 * @route '/employer/reviews'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::edit
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:81
 * @route '/employer/reviews/{review}/edit'
 */
export const edit = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/employer/reviews/{review}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::edit
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:81
 * @route '/employer/reviews/{review}/edit'
 */
edit.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { review: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { review: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    review: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        review: typeof args.review === 'object'
                ? args.review.id
                : args.review,
                }

    return edit.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::edit
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:81
 * @route '/employer/reviews/{review}/edit'
 */
edit.get = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::edit
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:81
 * @route '/employer/reviews/{review}/edit'
 */
edit.head = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::update
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:93
 * @route '/employer/reviews/{review}'
 */
export const update = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/employer/reviews/{review}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::update
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:93
 * @route '/employer/reviews/{review}'
 */
update.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { review: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { review: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    review: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        review: typeof args.review === 'object'
                ? args.review.id
                : args.review,
                }

    return update.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::update
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:93
 * @route '/employer/reviews/{review}'
 */
update.put = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::destroy
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:111
 * @route '/employer/reviews/{review}'
 */
export const destroy = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employer/reviews/{review}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::destroy
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:111
 * @route '/employer/reviews/{review}'
 */
destroy.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { review: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { review: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    review: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        review: typeof args.review === 'object'
                ? args.review.id
                : args.review,
                }

    return destroy.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::destroy
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:111
 * @route '/employer/reviews/{review}'
 */
destroy.delete = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::canReview
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:129
 * @route '/employer/applications/{application}/can-review'
 */
export const canReview = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: canReview.url(args, options),
    method: 'get',
})

canReview.definition = {
    methods: ["get","head"],
    url: '/employer/applications/{application}/can-review',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::canReview
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:129
 * @route '/employer/applications/{application}/can-review'
 */
canReview.url = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { application: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: typeof args.application === 'object'
                ? args.application.id
                : args.application,
                }

    return canReview.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::canReview
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:129
 * @route '/employer/applications/{application}/can-review'
 */
canReview.get = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: canReview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerReviewController::canReview
 * @see app/Http/Controllers/Employer/EmployerReviewController.php:129
 * @route '/employer/applications/{application}/can-review'
 */
canReview.head = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: canReview.url(args, options),
    method: 'head',
})
const reviews = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
canReview: Object.assign(canReview, canReview),
}

export default reviews