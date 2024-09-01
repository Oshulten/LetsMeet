/* eslint-disable react/react-in-jsx-scope */
import { createFileRoute } from '@tanstack/react-router'
import GoogleMap from '../components/GoogleMap'

export const Route = createFileRoute('/home')({
  component: () => <>
    <GoogleMap />
  </>
})
