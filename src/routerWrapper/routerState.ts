import userRoutes from "../routes/user.route";
import companyRoutes from "../routes/company.route";
import authRoutes from "../routes/auth.route";

const serverRoutes = [
  { path: "/users", name: userRoutes },
  { path: "/company", name: companyRoutes },
  { path: "/auth", name: authRoutes },
];

export const routerState = (app: any) => {
  const myRoutes = serverRoutes.map((route) => {
    app.use(route.path, route.name);
  });
  return myRoutes;
};
