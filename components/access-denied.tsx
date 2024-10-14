import { SignIn } from "@/components/auth-components";
import { Container } from "@/components/container";
import { AlertTriangle } from "lucide-react";

export const AccessDenied = () => {
  return (
    <Container className="text-center">
      <AlertTriangle className="mx-auto mb-5 size-8 stroke-yellow-500" />
      <h1 className="text-2xl font-bold">Access Denied</h1>
      <p>You must be signed in to view this page</p>
      <SignIn className="mt-10" />
    </Container>
  );
};
