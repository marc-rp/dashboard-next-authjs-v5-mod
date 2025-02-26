"use client";

import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

const ClientPage = () => {
  const user = useCurrentUser();

  return (
    <div className="flex justify-center items-center p-14 sm:ml-14">
      <UserInfo label="📱 Client component" user={user} />
    </div>
  );
};

export default ClientPage;
