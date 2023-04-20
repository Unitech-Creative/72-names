import Layout from "../components/layout";
import Image from "next/image";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import toast from "react-hot-toast";
import { useState } from "react";
import { Title, Card, MultiSelectBox, MultiSelectBoxItem } from "@tremor/react";

import { trpc } from "@/utils/trpc";
import { AdminRoute } from "@/lib/security";

export default function AdminPage() {
  const { data: products = [], isLoading: productsLoading } =
    trpc.admin.products.useQuery();

  return (
    <Layout>
      <motion.div
        className="max-w-xl px-5 xl:px-0"
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.h1
          className="font-display bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          ADMIN
        </motion.h1>
        <motion.p
          className="mt-6 text-center text-gray-500 md:text-xl"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          WOW!
        </motion.p>
      </motion.div>

      <div className="my-10 w-full max-w-7xl">
        <UsersList products={products} productsLoading={productsLoading} />
      </div>
    </Layout>
  );
}

function UsersList({ products, productsLoading }) {
  const { data: users = [], isLoading: usersLoading } =
    trpc.admin.users.useQuery();

  if (usersLoading || productsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <Title>Users</Title>
      <div className="-mx-4 mt-8 sm:-mx-0">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                Name
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Subscription
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 ">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                  <div className="flex items-center gap-x-5 ">
                    <Image
                      alt={user.email}
                      src={user.image}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      {user.name}
                      <div className="text-xs">{user.id}</div>
                    </div>
                  </div>
                  <dl className="font-normal lg:hidden">
                    <dt className="sr-only sm:hidden">Email</dt>
                    <dd className="mt-1 truncate text-gray-500 sm:hidden">
                      {user.email}
                    </dd>
                  </dl>
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  {user.email}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  <ProductSelectBox
                    user={user}
                    products={products}
                    subscriptions={user.subscriptions}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function ProductSelectBox({ user, products, subscriptions }) {
  const [priceIds, setPriceIds] = useState(subscriptions.map((s) => s.priceId));
  const { mutateAsync: createSubscription } =
    trpc.stripe.createSubscription.useMutation();

  return (
    <MultiSelectBox
      defaultValue={undefined}
      value={priceIds}
      onValueChange={async (values) => {
        setPriceIds(values);
        const result = await createSubscription({
          priceIds: values,
          userId: user.id,
        });
        if (result.success) {
          toast("Subscriptions updated successfully!", { type: "success" });
        } else {
          toast("Subscriptions updated failed!", { type: "error" });
        }
      }}
      placeholder="Subscriptions"
      icon={undefined}
      maxWidth="max-w-none"
      marginTop="mt-0"
    >
      {products.map((product) => (
        <MultiSelectBoxItem
          value={product.prices[0]?.id}
          text={product.name}
          icon={undefined}
          key={product.id}
        />
      ))}
    </MultiSelectBox>
  );
}

export async function getServerSideProps(context) {
  const props = await AdminRoute(context);
  if (props.redirect) return props;

  return {
    props: {},
  };
}
