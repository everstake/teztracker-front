import { mutations as appMutations, state as appState } from "@/store/modules/app.module";
import { SET_APP_NETWORK } from '@/store/mutations.types';

export default function network({ to, next, nextMiddleware }) {
  const routeNetwork = to.params.network;
  const { network: appNetwork, networkList } = appState;
  const routeNetworkNotAllowed = !networkList.includes(routeNetwork);

  if (!routeNetwork || routeNetworkNotAllowed) {
    to.params.network = appNetwork;
    return next({ ...to });
  }

  if (appNetwork !== routeNetwork) {
    appMutations[SET_APP_NETWORK](appState, routeNetwork);
  }

  return nextMiddleware();
}
