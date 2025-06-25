import userRoutes from "../routes/user.route";
import companyRoutes from "../routes/company.route";
import authRoutes from "../routes/auth.route";
import translateRoutes from "../routes/translate.route";

const serverRoutes = [
  { path: "/users", name: userRoutes },
  { path: "/companyes", name: companyRoutes },
  { path: "/auth", name: authRoutes },
  { path: "/translate", name: translateRoutes },
];

export const routerState = (app: any) => {
  const myRoutes = serverRoutes.map((route) => {
    app.use(route.path, route.name);
  });
  return myRoutes;
};
