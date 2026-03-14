import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  console.log("inside auth");
  return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;
