/* eslint-disable react/react-in-jsx-scope */
import { useMap } from "@vis.gl/react-google-maps";
import useDirections from "../hooks/useDirections";

export default function Direction() {
    const { route, renderRoute } = useDirections();
    const map = useMap();

    if (!route || !map) {
        return <></>
    }

    renderRoute(map, route);

    return <></>
}