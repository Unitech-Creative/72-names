import { Bookmark } from "lucide-react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { trpc } from "@/utils/trpc";

export default function HeartButton({ lessonId, className }) {
  const [liked, setLiked] = useState(false);
  const { data, isLoading } = trpc.like.get.useQuery(
    { lessonId: lessonId },
    {
      onSuccess: (data) => {
        setLiked(data);
      },
    }
  );
  const { mutateAsync: toggleLike } = trpc.like.toggle.useMutation();

  if (isLoading) return;

  const handleChange = async () => {
    setLiked(liked ? false : true);
    await toggleLike({ lessonId });
  };

  return (
    <button onClick={(e) => handleChange()} className={className}>
      {liked ? (
        <Bookmark className="fill-red-500 text-red-400 hover:fill-red-700" />
      ) : (
        <Bookmark className="fill-white text-black hover:fill-red-300" />
      )}
      <FormattedMessage id="heartButton" defaultMessage="Save" />
    </button>
  );
}
