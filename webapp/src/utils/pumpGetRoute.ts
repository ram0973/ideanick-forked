import { useParams as useReactRouterParams } from 'react-router-dom'

// eslint-disable-next-line node/no-process-env
const baseUrl = process.env.VITE_WEBAPP_URL || process.env.WEBAPP_URL

type PumpedGetRouteInputBase = {
  abs?: boolean
}

function pumpGetRoute<T extends Record<string, boolean>>(
  routeParamsDefinition: T,
  getRoute: (routeParams: Record<keyof T, string>) => string
): {
  (routeParams: Record<keyof T, string> & PumpedGetRouteInputBase): string
  placeholders: Record<keyof T, string>
  useParams: () => Record<keyof T, string>
  definition: string
}
function pumpGetRoute(getRoute: () => string): {
  (routeParams?: PumpedGetRouteInputBase): string
  placeholders: {}
  useParams: () => {}
  definition: string
}
function pumpGetRoute(routeParamsOrGetRoute?: any, maybeGetRoute?: any) {
  const routeParamsDefinition = typeof routeParamsOrGetRoute === 'function' ? {} : routeParamsOrGetRoute
  const getRoute = typeof routeParamsOrGetRoute === 'function' ? routeParamsOrGetRoute : maybeGetRoute
  const placeholders = Object.keys(routeParamsDefinition).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {})
  const definition = getRoute(placeholders)
  const pumpedGetRoute = (routeParams?: PumpedGetRouteInputBase) => {
    const route = getRoute(routeParams)
    if (routeParams?.abs) {
      return `${baseUrl}${route}`
    } else {
      return route
    }
  }
  pumpedGetRoute.placeholders = placeholders
  pumpedGetRoute.definition = definition
  pumpedGetRoute.useParams = useReactRouterParams as any
  return pumpedGetRoute
}

export type RouteParams<T extends { placeholders: Record<string, string> }> = T['placeholders']

export const pgr = pumpGetRoute
