export default function page({ to, next, nextMiddleware }) {
  const routePage = to.params.page;
  const routePageNotAllowed = routePage < 1;
  const routePageNotNumber = isNaN(routePage) && isNaN(parseInt(routePage));

  if (!routePage || routePageNotNumber || routePageNotAllowed) {
    to.params.page = 1;
    return next({ ...to });
  }

  return nextMiddleware();
}
