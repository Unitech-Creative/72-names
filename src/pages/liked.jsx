import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import Link from "next/link";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { Bookmark } from "lucide-react";
import { trpc } from "@/utils/trpc";
import sanityClient from "@/lib/sanity-client";
import { FormattedMessage } from "react-intl";
import { useAtom } from "jotai";
import { hasPermissionAtom } from "@/atoms/index";

export default function Page({}) {
  return <Layout>Liked Stuff</Layout>;
}

