export default function readableDistance(distanceInMeters: number) {
    if (distanceInMeters > 10_000)
        return `${(distanceInMeters / 1000).toFixed(0)} kilometers`;
    if (distanceInMeters > 1000)
        return `${(distanceInMeters / 1000).toFixed(1)} kilometers`;
    if (distanceInMeters > 500)
        return `${(distanceInMeters / 100).toFixed(0)}00 meters`;
    return `${distanceInMeters.toFixed(0)} meters`;
}