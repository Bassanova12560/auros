import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";

import { ACADEMY_DISCLAIMER } from "./constants";
import { formatIssuedDate } from "./cert-token";
import type { AcademyCertificate } from "./types";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    backgroundColor: "#0a0f0d",
    color: "#e8ebe9",
  },
  border: {
    borderWidth: 1,
    borderColor: "#34d399",
    padding: 36,
    flex: 1,
  },
  brand: {
    fontSize: 9,
    letterSpacing: 3,
    color: "#6ee7b7",
    textTransform: "uppercase",
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 8,
    color: "#ffffff",
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    color: "#a7b4ad",
    marginBottom: 28,
  },
  name: {
    fontSize: 22,
    textAlign: "center",
    color: "#ffffff",
    marginTop: 12,
    marginBottom: 24,
    fontWeight: 700,
  },
  meta: {
    fontSize: 10,
    textAlign: "center",
    color: "#94a39a",
    marginBottom: 6,
  },
  verify: {
    fontSize: 8,
    textAlign: "center",
    color: "#6ee7b7",
    marginTop: 24,
    marginBottom: 8,
  },
  note: {
    fontSize: 7,
    textAlign: "center",
    color: "#7a8a82",
    marginTop: 16,
    lineHeight: 1.4,
  },
  footer: {
    fontSize: 6.5,
    textAlign: "center",
    color: "#5c6b64",
    marginTop: 20,
    lineHeight: 1.35,
  },
});

export async function generateIndividualDiplomaPdf(input: {
  certificate: AcademyCertificate;
  verifyUrl: string;
}): Promise<Blob> {
  const { certificate, verifyUrl } = input;
  const issued = formatIssuedDate(certificate.issuedAt);
  const expires = certificate.expiresAt
    ? formatIssuedDate(certificate.expiresAt)
    : "—";

  const doc = (
    <Document title={`AUROS Academy — ${certificate.fullName}`} author="AUROS">
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <Text style={styles.brand}>AUROS Academy</Text>
          <Text style={styles.title}>Diplôme de certification</Text>
          <Text style={styles.subtitle}>{certificate.tierLabel}</Text>
          <Text style={styles.name}>{certificate.fullName}</Text>
          <Text style={styles.meta}>Délivré le {issued}</Text>
          <Text style={styles.meta}>Attestation n° {certificate.id}</Text>
          <Text style={styles.meta}>
            Statut en ligne valide jusqu&apos;au {expires} (renouvelable)
          </Text>
          <Text style={styles.verify}>Vérification : {verifyUrl}</Text>
          <Text style={styles.note}>
            Ce document PDF reste à votre disposition. La page de vérification indique le statut
            actuel de l&apos;attestation (validité 90 jours, micro-renouvellement gratuit).
          </Text>
          <Text style={styles.footer}>{ACADEMY_DISCLAIMER}</Text>
        </View>
      </Page>
    </Document>
  );

  return pdf(doc).toBlob();
}

export async function generateInstitutionDiplomaPdf(input: {
  organizationName: string;
  purchaseId: string;
  issuedAt: string;
  verifyUrl: string;
}): Promise<Blob> {
  const issued = formatIssuedDate(input.issuedAt);

  const doc = (
    <Document title={`AUROS Academy — ${input.organizationName}`} author="AUROS">
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <Text style={styles.brand}>AUROS Academy</Text>
          <Text style={styles.title}>Certificat établissement partenaire</Text>
          <Text style={styles.subtitle}>Engagement formation RWA</Text>
          <Text style={styles.name}>{input.organizationName}</Text>
          <Text style={styles.meta}>Délivré le {issued}</Text>
          <Text style={styles.meta}>Certificat n° {input.purchaseId}</Text>
          <Text style={styles.verify}>Référence : {input.verifyUrl}</Text>
          <Text style={styles.note}>
            Document permanent attestant l&apos;engagement de l&apos;établissement dans la
            formation et la veille RWA via AUROS Academy.
          </Text>
          <Text style={styles.footer}>{ACADEMY_DISCLAIMER}</Text>
        </View>
      </Page>
    </Document>
  );

  return pdf(doc).toBlob();
}

export function diplomaFilename(name: string, id: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40)
    .toLowerCase();
  return `auros-academy-${slug || "diplome"}-${id}.pdf`;
}
