import { currentUser } from "@/lib/auth";
import { UserInfo } from "@/components/user-info";

const ServerPage = async () => {
  const user = await currentUser();

  return (
    <div className="flex justify-center items-center p-14 sm:ml-14">
      <UserInfo label="💻 Server component" user={user} />
    </div>
  );
};

export default ServerPage;
