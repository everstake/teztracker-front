export default function page({ to, next, nextMiddleware }) {
  const routePage = to.params.page;
  const routePageNotAllowed = routePage < 1;

  if (!routePage || routePageNotAllowed) {
    to.params.page = 1;
    return next({ ...to });
  }

  return nextMiddleware();
}
