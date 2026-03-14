import { SignIn } from "@clerk/nextjs";

export const SingInView = () => {
  return <SignIn routing="hash" />;
};
