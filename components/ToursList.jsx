import TourCard from "./TourCard";

function ToursList({ data }) {
  if (!data.length) return <h1 className="text-lg">No tours found...</h1>;
  return (
    <div className="grid sm:grid cols-2 lg:grid-cols-4 gap-8">
      {data.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}

export default ToursList;
