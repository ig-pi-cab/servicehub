import AgendaCard from "../../components/AgendaCard";
import ServicesCard from "../../components/ServicesCard";

export default function DashboardPage() {
  return (
    <div className="flex gap-4">
      <section className="w-1/3 bg-white rounded-lg shadow p-4">
        <AgendaCard />
      </section>
      <section className="flex-1 bg-white rounded-lg shadow p-4">
        <ServicesCard />
      </section>
    </div>
  );
}
