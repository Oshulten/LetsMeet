/* eslint-disable react/react-in-jsx-scope */
import { createRootRoute, Navigate, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
    component: () => (
        <>
            <Navigate to="/home" />
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
})