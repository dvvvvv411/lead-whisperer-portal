
import UserAuthWrapper from "@/components/user/auth/UserAuthWrapper";
import UserNavbar from "@/components/user/UserNavbar";
import InviteFriendsTab from "@/components/user/affiliate/InviteFriendsTab";

const UserInviteFriends = () => {
  return (
    <UserAuthWrapper redirectTo="/auth">
      {(user) => {
        // Add null check for user object
        if (!user) {
          return (
            <div className="flex justify-center items-center min-h-screen bg-casino-darker">
              <p className="text-white">Wird geladen...</p>
            </div>
          );
        }

        return (
          <div className="min-h-screen bg-casino-darker">
            <UserNavbar userId={user.id} userEmail={user.email} />
            <InviteFriendsTab />
          </div>
        );
      }}
    </UserAuthWrapper>
  );
};

export default UserInviteFriends;
