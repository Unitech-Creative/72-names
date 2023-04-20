import { Novu } from "@novu/node";
const novu = new Novu(process.env.NOVU_API_KEY);

export async function identifyUser(user) {
  const { firstName, lastName } = splitFullName(user.name);

  const result = await novu.subscribers.identify(user.id, {
    email: user.email,
    firstName: firstName,
    lastName: lastName,
    avatar: user.image,
    // locale: user.locale,
    // data: { custom1: "customval1", custom2: "customval2" },
  });

  if (result.status === 201) {
    // Subscriber was created # always true for identify
    return { status: 201 };
  }

  return result;
}

function splitFullName(fullName) {
  const nameParts = fullName.trim().split(/\s+/);
  const lastName = nameParts.pop();
  const firstName = nameParts.join(" ");

  return {
    firstName: firstName,
    lastName: lastName,
  };
}
