import {
  NovuProvider,
  PopoverNotificationCenter,
} from "@novu/notification-center";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

const Novu = () => {
  const { data: session, status } = useSession();
  const { locale } = useIntl();

  if (status !== "authenticated" || !session?.user?.id) {
    return null;
  }

  const i18n =
    locale == "ru"
      ? {
          lang: locale,
          translations: {
            poweredBy: " ",
            markAllAsRead: "Отметить все, как прочитанное ",
            notifications: "Уведомления",
            settings: "Настройки",
          },
        }
      : locale;

  return (
    <NovuProvider
      i18n={i18n}
      subscriberId={session.user.id}
      applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_APP_ID}
    >
      <PopoverWrapper />
    </NovuProvider>
  );
};

export default Novu;

function PopoverWrapper() {
  const router = useRouter();

  function handlerOnNotificationClick(message) {
    if (message?.cta?.data?.url) {
      router.push(message.cta.data.url);
    }
  }

  return (
    <PopoverNotificationCenter
      onNotificationClick={handlerOnNotificationClick}
      colorScheme="light"
    >
      {({ unseenCount }) => {
        return (
          <CustomBell unseenCount={unseenCount} className="cursor-pointer" />
        );
      }}
    </PopoverNotificationCenter>
  );
}

function CustomBell({ unseenCount, ...props }) {
  return (
    <div className="relative w-5">
      <Bell {...props} />
      {unseenCount > 0 && (
        <div className="absolute -top-3 -right-3.5">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 p-1 text-xs text-white">
            {unseenCount > 9 ? "9+" : unseenCount}
          </span>
        </div>
      )}
    </div>
  );
}
