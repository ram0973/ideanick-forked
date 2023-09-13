const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {}) as Record<keyof T, string>
}

export const getAllIdeasRoute = () => '/'

export const viewIdeaRouteParams = getRouteParams({ ideaNick: true })
export type ViewIdeaRouteParams = typeof viewIdeaRouteParams
export const getViewIdeaRoute = ({ ideaNick }: ViewIdeaRouteParams) => `/ideas/${ideaNick}`

export const getNewIdeaRoute = () => '/ideas/new'

export const getSignUpRoute = () => '/sign-up'

export const getSignInRoute = () => '/sign-in'

export const getSignOutRoute = () => '/sign-out'
