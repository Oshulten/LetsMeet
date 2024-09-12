import { useMap } from "@vis.gl/react-google-maps";
import useDirections from "../hooks/useDirections";

export default function Direction() {
    const map = useMap();
    useDirections(map);
    return null;
}