
export default async function getPosition(options?: PositionOptions): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );
}
