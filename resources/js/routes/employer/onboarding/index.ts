import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\OnboardingController::index
 * @see app/Http/Controllers/Employer/OnboardingController.php:19
 * @route '/employer/onboarding'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employer/onboarding',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\OnboardingController::index
 * @see app/Http/Controllers/Employer/OnboardingController.php:19
 * @route '/employer/onboarding'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\OnboardingController::index
 * @see app/Http/Controllers/Employer/OnboardingController.php:19
 * @route '/employer/onboarding'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\OnboardingController::index
 * @see app/Http/Controllers/Employer/OnboardingController.php:19
 * @route '/employer/onboarding'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\OnboardingController::save
 * @see app/Http/Controllers/Employer/OnboardingController.php:52
 * @route '/employer/onboarding/save'
 */
export const save = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(options),
    method: 'post',
})

save.definition = {
    methods: ["post"],
    url: '/employer/onboarding/save',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employer\OnboardingController::save
 * @see app/Http/Controllers/Employer/OnboardingController.php:52
 * @route '/employer/onboarding/save'
 */
save.url = (options?: RouteQueryOptions) => {
    return save.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\OnboardingController::save
 * @see app/Http/Controllers/Employer/OnboardingController.php:52
 * @route '/employer/onboarding/save'
 */
save.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Employer\OnboardingController::complete
 * @see app/Http/Controllers/Employer/OnboardingController.php:122
 * @route '/employer/onboarding/complete'
 */
export const complete = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/employer/onboarding/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employer\OnboardingController::complete
 * @see app/Http/Controllers/Employer/OnboardingController.php:122
 * @route '/employer/onboarding/complete'
 */
complete.url = (options?: RouteQueryOptions) => {
    return complete.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\OnboardingController::complete
 * @see app/Http/Controllers/Employer/OnboardingController.php:122
 * @route '/employer/onboarding/complete'
 */
complete.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(options),
    method: 'post',
})
const onboarding = {
    index: Object.assign(index, index),
save: Object.assign(save, save),
complete: Object.assign(complete, complete),
}

export default onboarding