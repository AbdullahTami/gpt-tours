import { getUserTokensById } from "@/utlis/actions";
import { UserProfile, auth } from "@clerk/nextjs";

async function ProfilePage() {
  const { userId } = auth();
  const currentTokens = await getUserTokensById(userId);
  return (
    <div>
      <h2 className="mb-8 ml-8 text-xl font-extrabold">
        Token Amount : {currentTokens}
      </h2>
      <UserProfile />
    </div>
  );
}

export default ProfilePage;
