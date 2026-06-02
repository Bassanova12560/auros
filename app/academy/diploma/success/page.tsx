import { DiplomaSuccessMissing, DiplomaSuccessView } from "../../_components/DiplomaSuccessView";

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function AcademyDiplomaSuccessPage({ searchParams }: PageProps) {
  const { session_id: sessionId } = await searchParams;

  return (
    <div className="page-inner page-inner--2xl mx-auto px-4 pb-16 pt-10 md:px-6">
      {sessionId ? <DiplomaSuccessView sessionId={sessionId} /> : <DiplomaSuccessMissing />}
    </div>
  );
}
