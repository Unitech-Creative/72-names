import { isValid, parseISO, format, formatDistanceToNow } from "date-fns";
import { FormattedMessage, useIntl } from "react-intl";

export default function FormattedDate({ date }) {
  const { locale } = useIntl();

  return (
    <time dateTime={date} title={format(date, "PPPPpp")}>
      {locale == "en" ? en(date) : ru(date)}
    </time>
  );
}

function en(date) {
  return formatDistanceToNow(date, {
    addSuffix: true,
  });
}

function ru(date) {
  const parsedDate = date;
  const intl = useIntl();

  const messages = {
    secondsAgo: intl.formatMessage({ id: "seconds-ago" }),
    minuteAgo: intl.formatMessage({ id: "minute-ago" }),
    minutesAgo: intl.formatMessage({ id: "minutes-ago" }),
    hourAgo: intl.formatMessage({ id: "hour-ago" }),
    hoursAgo: intl.formatMessage({ id: "hours-ago" }),
    dayAgo: intl.formatMessage({ id: "day-ago" }),
    daysAgo: intl.formatMessage({ id: "days-ago" }),
  };

  const now = new Date();
  const distance = now - parsedDate;
  const distanceInSeconds = Math.round(distance / 1000);

  let timeAgo;

  if (distanceInSeconds < 60) {
    timeAgo = `${distanceInSeconds} ${messages.secondsAgo}`;
  } else if (distanceInSeconds < 3600) {
    const minutes = Math.round(distanceInSeconds / 60);
    timeAgo =
      minutes === 1
        ? `${minutes} ${messages.minuteAgo}`
        : `${minutes} ${messages.minutesAgo}`;
  } else if (distanceInSeconds < 86400) {
    const hours = Math.round(distanceInSeconds / 3600);
    timeAgo =
      hours === 1
        ? `${hours} ${messages.hourAgo}`
        : `${hours} ${messages.hoursAgo}`;
  } else {
    const days = Math.round(distanceInSeconds / 86400);
    timeAgo =
      days === 1 ? `${days} ${messages.dayAgo}` : `${days} ${messages.daysAgo}`;
  }

  return timeAgo;
}
