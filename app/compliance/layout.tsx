import { Protected } from "@/components/protected";

export default function ComplianceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Protected>{children}</Protected>;
}
