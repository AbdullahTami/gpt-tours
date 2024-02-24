"use client";

import { getAllTours } from "@/utlis/actions";
import { useQuery } from "@tanstack/react-query";
import ToursList from "./ToursList";
import { useState } from "react";

function ToursPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isPending } = useQuery({
    queryKey: ["tours", searchTerm],
    queryFn: () => getAllTours(searchTerm),
  });
  return (
    <>
      <form className="max-w-lg mb-12">
        <div className="w-full join">
          <input
            type="text"
            className="input input-bordered join-item w-full"
            placeholder="enter city or country here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            required
          />
          <button
            className="btn btn-primary join-item"
            disabled={isPending}
            type="button"
            onClick={() => setSearchTerm("")}
          >
            {isPending ? "please wait..." : "reset"}
          </button>
        </div>
      </form>
      {isPending ? (
        <span className="loading"></span>
      ) : (
        <ToursList data={data} />
      )}
    </>
  );
}

export default ToursPage;
