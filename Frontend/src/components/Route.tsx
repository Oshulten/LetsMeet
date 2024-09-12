import { useMap } from "@vis.gl/react-google-maps";
import useRoutes from "../hooks/useRoutes";

export default function Route() {
    const map = useMap();
    useRoutes(map);
    return null;
}