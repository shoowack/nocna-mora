import { ComponentPropsWithRef } from "react";
import { signIn, signOut } from "auth";
import { Button } from "@/components/ui/button";

export function SignIn({
  provider,
  ...props
}: { provider?: string } & ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
      className="!p-0"
    >
      <Button {...props}>Prijava</Button>
    </form>
  );
}

export function SignOut(props: ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="!p-0"
    >
      <Button {...props}>Odjava</Button>
    </form>
  );
}
