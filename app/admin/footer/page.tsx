import FooterManager from "@/components/admin/FooterManager";
import ClientWrapper from "@/components/admin/ClientWrapper";

export const dynamic = "force-dynamic";

export default function FooterManagerPage() {
  return (
    <ClientWrapper>
      <FooterManager />
    </ClientWrapper>
  );
}
