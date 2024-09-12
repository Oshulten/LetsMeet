/* eslint-disable react/react-in-jsx-scope */
import { createRootRoute, Navigate, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const Route = createRootRoute({
    component: () => (
        <>
            <Navigate to="/home" />
            <Outlet />
            {/* <TanStackRouterDevtools />
            <ReactQueryDevtools /> */}
        </>
    ),
})