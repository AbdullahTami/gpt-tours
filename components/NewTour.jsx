"use client";

import {
  createNewTour,
  generateTourResponse,
  getExistingTour,
  getUserTokensById,
  subtractTokens,
} from "@/utlis/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import TourInfo from "./TourInfo";
import { useAuth } from "@clerk/nextjs";

function NewTour() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const {
    mutate,
    isPending,
    data: tour,
  } = useMutation({
    mutationFn: async (destination) => {
      const existingTour = await getExistingTour(destination);
      if (existingTour) return existingTour;

      const currentTokens = await getUserTokensById(userId);
      if (currentTokens <300) {
        toast.error("Token balance too low...");
        return null;
      }

      const newTour = await generateTourResponse(destination);
      if (!newTour) {
        toast.error("No matching city found...");
        return null;
      }

      await createNewTour(newTour.tour);
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      const newTokens = await subtractTokens(userId, newTour.tokens);
      toast.success(`${newTokens} tokens remaining...`);
      return newTour.tour;
    },
  });
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const destination = Object.fromEntries(formData.entries());
    mutate(destination);
  }

  if (isPending) return <span className="loading loading-lg"></span>;

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <h2 className="mb-2">Select your dream destination</h2>
        <div className="join w-full">
          <input
            type="text"
            className="input-bordered pl-3 join-item w-full"
            placeholder="city"
            name="city"
            required
          />
          <input
            type="text"
            className="input-bordered pl-3 join-item w-full"
            placeholder="country"
            name="country"
            required
          />
          <button className="btn btn-primary join-item" type="submit">
            generate tour
          </button>
        </div>
      </form>
      <div className="mt-16">{tour && <TourInfo tour={tour} />}</div>
    </>
  );
}

export default NewTour;
