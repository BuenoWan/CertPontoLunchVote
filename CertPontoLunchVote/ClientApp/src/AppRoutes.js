import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { MostVotedRestaurant } from "./components/Result";
import { Votacao } from "./components/Votacao";
import { Home } from "./components/Home";

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/votacao',
        requireAuth: true,
        element: <Votacao />
    },
    {
        path: '/result',
        element: <MostVotedRestaurant />
    },

    ...ApiAuthorzationRoutes
];

export default AppRoutes;
