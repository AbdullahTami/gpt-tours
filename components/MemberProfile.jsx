import { UserButton, currentUser } from "@clerk/nextjs";

async function MemberProfile() {
  const user = await currentUser();

  return (
    <div className="px-4 flex items-center flex-center gap-2">
      <UserButton afterSignOutUrl="/" />
      <p>{user.emailAddresses[0].emailAddress}</p>
    </div>
  );
}

export default MemberProfile;
