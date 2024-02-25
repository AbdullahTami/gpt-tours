import TourInfo from "@/components/TourInfo";
import { generateTourImage, getSingleTour } from "@/utlis/actions";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function SingleTourPage({ params }) {
  const tour = await getSingleTour(params.tourId);

  if (!tour) redirect("/tours");

  const tourImage = await generateTourImage({
    city: tour.city,
    country: tour.country,
  });
  return (
    <div>
      <Link href={"/tours"} className="btn btn-secondary mb-12">
        back to tours
      </Link>
      {tourImage && (
        <div>
          <Image
            src={tourImage}
            width={300}
            height={300}
            className="rounded-xl object-cover shadow-xl mb-16 h-96 w-96"
            alt={tour.title}
            priority
          />
        </div>
      )}
      <TourInfo tour={tour} />
    </div>
  );
}

export default SingleTourPage;
