import { Protected } from "@/components/protected";

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Protected>{children}</Protected>;
}
