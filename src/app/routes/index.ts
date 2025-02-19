import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BrandsRoutes } from "../modules/brand/brand.route";
import { CategoriesRoutes } from "../modules/category/category.route";
import { OrdersRoutes } from "../modules/order/order.route";
import { ProductsRoutes } from "../modules/product/product.route";
import { VendorsRoutes } from "../modules/vendor/vendor.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/vendors",
    route: VendorsRoutes,
  },
  {
    path: "/brands",
    route: BrandsRoutes,
  },
  {
    path: "/categories",
    route: CategoriesRoutes,
  },
  {
    path: "/products",
    route: ProductsRoutes,
  },
  {
    path: "/orders",
    route: OrdersRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
