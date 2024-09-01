/* eslint-disable react/react-in-jsx-scope */
import { createFileRoute } from '@tanstack/react-router'
import NotificationComponent from '../components/NotificationComponent'

export const Route = createFileRoute('/home')({
  component: () => <>
    <NotificationComponent />
  </>
})
