import Image from "next/image";
import { useEffect, useState } from "react";
import Date from "../date";
import Form from "./form";
import { useAtom } from "jotai";
import clsx from "clsx";
import { MessageCircle } from "lucide-react";
import {
  hasPermissionAtom,
  lessonAtom,
  commentsAtom,
  adminAtom,
} from "@/atoms/index";
import { trpc } from "@/utils/trpc";
import { DeleteCommentButton } from "./delete";
import { FormattedMessage } from "react-intl";
import Skeleton from "react-loading-skeleton";
import { useQueryClient } from "@tanstack/react-query";

export default function CommentsSection() {
  const [comments, setComments] = useAtom(commentsAtom);
  const [hasPermission] = useAtom(hasPermissionAtom);
  const [lesson] = useAtom(lessonAtom);
  const { data: _comments, isLoading: loadingComments } =
    trpc.comments.all.useQuery({
      lessonId: lesson._id,
    });

  const [scrolledIntoView, setScrolledIntoView] = useState(false);

  useEffect(() => {
    if (hasPermission && _comments) {
      setComments(_comments);
      if (scrolledIntoView) return;

      const commentId = window.location.hash.substring(1);
      setTimeout(() => {
        setScrolledIntoView(true);
        const commentEl = document.getElementById(commentId);
        if (commentEl) {
          commentEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 10);
    }
  }, [_comments, scrolledIntoView, setComments, hasPermission]);

  if (!hasPermission)
    return (
      <div className="mt-10">
        <Skeleton count={3} />
      </div>
    );

  if (loadingComments)
    return (
      <div className="mt-10">
        {<FormattedMessage id="loading" defaultMessage="loading..." />}
      </div>
    );

  return (
    <div className="mt-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900  lg:text-2xl">
          Discussion ({comments.length})
        </h2>
      </div>

      <Form />
      {!loadingComments && <Comments comments={comments} />}
    </div>
  );
}

function Comments({ comments = [] }) {
  return (
    <>
      {comments?.map((comment) => (
        <div key={comment.id}>
          <article
            className={clsx(
              "mb-6 rounded-lg border border-gray-300 bg-white p-6 text-base"
            )}
          >
            <Comment item={comment} parent={comment} />
          </article>
          {comment.childComments?.length > 0 && (
            <SubComments comments={comment.childComments} parent={comment} />
          )}
        </div>
      ))}
    </>
  );
}

const SubComments = function ({ comments = [], parent }) {
  return comments?.map((comment) => (
    <div key={comment.id}>
      <article
        className={clsx(
          "mb-6 rounded-lg border border-gray-300 bg-white p-6 text-base",
          "ml-6 lg:ml-12"
        )}
      >
        <Comment item={comment} parent={parent} />
      </article>
    </div>
  ));
};

const Comment = function ({ item, parent }) {
  const { createdAt, commentText: comment, user } = item;
  const [isReplying, setIsReplying] = useState(false);
  const [admin] = useAtom(adminAtom);
  const [lesson] = useAtom(lessonAtom);
  const queryClient = useQueryClient();

  function handleDelete() {
    queryClient.invalidateQueries({
      queryKey: [["comments", "all"], { lessonId: lesson._id }],
    });
  }

  return (
    <>
      <a id={`comment-${item.id}`}></a>
      <footer className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <p className="mr-3 inline-flex items-center text-sm text-gray-900 ">
            <Image
              width="24"
              height="24"
              className="mr-2 h-6 w-6 rounded-full"
              src={user.image}
              alt={user.name}
            />
            {user.name}
          </p>
          <p className="text-sm text-gray-600 ">
            <time
              pubdate=""
              dateTime="2022-02-08"
              title={<Date date={createdAt} />}
            >
              <Date date={createdAt} />
            </time>
          </p>
        </div>

        {/* Dropdown menu */}
        {admin && (
          <DeleteCommentButton onDelete={handleDelete} comment={item} />
        )}
      </footer>
      <p className="text-gray-500 ">{comment}</p>
      <div className="mt-4">
        <div className="mt-4 flex items-center space-x-4">
          <button
            type="button"
            className="flex items-center text-sm text-gray-500 hover:underline "
            onClick={() => {
              setIsReplying(!isReplying);
            }}
          >
            <MessageCircle className="mr-1 h-4 w-4" />
            {<FormattedMessage id="reply" defaultMessage="Reply" />}
          </button>
        </div>
        <div
          className={clsx("pt-5 pl-5", {
            hidden: !isReplying,
          })}
        >
          <Form
            replyTo={parent?.id}
            isReplying={isReplying}
            setIsReplying={setIsReplying}
          />
        </div>
      </div>
    </>
  );
};
