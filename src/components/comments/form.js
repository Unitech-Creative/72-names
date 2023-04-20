import { useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";
import { Button } from "@/components/Button";
import { lessonAtom, commentsAtom } from "@/atoms/index";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useQueryClient } from "@tanstack/react-query";

export default function Form({ replyTo, setIsReplying }) {
  const [lesson] = useAtom(lessonAtom);
  const queryClient = useQueryClient();
  const { _id } = lesson;
  const [formData, setFormData] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { mutateAsync: createComment } = trpc.comments.create.useMutation();
  const { mutateAsync: createCommentReply } =
    trpc.comments.createReply.useMutation();
  const intl = useIntl();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    let response;
    setFormData(data);
    try {
      const createData = {
        lessonId: _id,
        lessonTitle: lesson.title,
        comment: data.comment,
      };
      const createReplyData = {
        parentCommentId: replyTo,
        lessonTitle: lesson.title,
        comment: data.comment,
      };

      await (replyTo
        ? createCommentReply(createReplyData)
        : createComment(createData));

      queryClient.invalidateQueries({
        queryKey: [["comments", "all"], { lessonId: lesson._id }],
      });

      setIsSubmitting(false);
      setHasSubmitted(true);
    } catch (err) {
      setFormData(err);
    }
  };

  if (isSubmitting) {
    return (
      <h3>
        {
          <FormattedMessage
            id="submittingComment"
            defaultMessage="Submitting..."
          />
        }
      </h3>
    );
  }
  if (hasSubmitted) {
    return (
      <>
        <h3>
          {
            <FormattedMessage
              id="commentSubmitted"
              defaultMessage="Comment submitted!"
            />
          }
        </h3>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
      <div className="mb-4 rounded-lg rounded-t-lg border border-gray-200 bg-white py-2 px-4">
        <input {...register("_id")} type="hidden" name="_id" value={_id} />
        <label htmlFor="comment" className="sr-only">
          Your comment
        </label>
        <textarea
          {...register("comment", { required: true })}
          id="comment"
          name="comment"
          className="w-full border-0 px-0 text-sm text-gray-900 focus:outline-none focus:ring-0"
          rows="6"
          placeholder={intl.formatMessage({
            id: "addCommentPlaceholder",
            defaultMessage: "Add a comment...",
          })}
        />
        {/* errors will return when field validation fails */}
        {errors.comment && (
          <span className="text-sm text-red-500">
            {
              <FormattedMessage
                id="commentIsRequired"
                defaultMessage="Comment is required"
              />
            }
          </span>
        )}
      </div>
      <div className="flex justify-end space-x-3">
        {replyTo && (
          <Button
            onClick={() => {
              setIsReplying(false);
            }}
            variant="outline"
          >
            {<FormattedMessage id="Cancel" defaultMessage="Cancel" />}
          </Button>
        )}
        <Button type="Submit">
          {<FormattedMessage id="postComment" defaultMessage="Post Comment" />}
        </Button>
      </div>
    </form>
  );
}
