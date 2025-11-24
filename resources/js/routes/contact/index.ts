import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ContactController::submit
 * @see app/Http/Controllers/ContactController.php:22
 * @route '/contact'
 */
export const submit = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(options),
    method: 'post',
})

submit.definition = {
    methods: ["post"],
    url: '/contact',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ContactController::submit
 * @see app/Http/Controllers/ContactController.php:22
 * @route '/contact'
 */
submit.url = (options?: RouteQueryOptions) => {
    return submit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ContactController::submit
 * @see app/Http/Controllers/ContactController.php:22
 * @route '/contact'
 */
submit.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(options),
    method: 'post',
})
const contact = {
    submit: Object.assign(submit, submit),
}

export default contact