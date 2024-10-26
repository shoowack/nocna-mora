"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ReactionType } from "@prisma/client";
import { reactionIcons } from "@/constants/reaction-icons";

interface ReactionProps {
  videoId: string;
  userReaction?: { id: string; type: ReactionType };
}

export const Reactions = ({ videoId, userReaction }: ReactionProps) => {
  const [reaction, setReaction] = useState<ReactionType | undefined>(
    userReaction?.type
  );
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleReaction = async (type: ReactionType) => {
    setLoading(true);
    try {
      const response = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, type }),
      });

      if (response.ok) {
        setReaction(type);
        router.refresh(); // Refresh the page to show updated reaction count
      } else {
        console.error("Failed to add reaction.");
      }
    } catch (error) {
      console.error("Error while adding reaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveReaction = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reactions/${userReaction?.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReaction(undefined);
        router.refresh();
      } else {
        console.error("Failed to remove reaction.");
      }
    } catch (error) {
      console.error("Error while removing reaction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4 flex flex-col items-center gap-2 md:mb-0 md:flex-row">
      {Object.values(ReactionType).map((type) => (
        <Button
          key={type}
          onClick={() => handleReaction(ReactionType[type])}
          disabled={loading || reaction === ReactionType[type]}
          className="w-full md:w-auto"
        >
          {reactionIcons[type]}{" "}
          {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
        </Button>
      ))}
      {reaction && (
        <Button
          onClick={handleRemoveReaction}
          variant="destructive"
          disabled={loading}
        >
          Remove Reaction
        </Button>
      )}
    </div>
  );
};
