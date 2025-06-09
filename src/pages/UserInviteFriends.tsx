
import UserAuthWrapper from "@/components/user/auth/UserAuthWrapper";
import UserNavbar from "@/components/user/UserNavbar";
import InviteFriendsTab from "@/components/user/affiliate/InviteFriendsTab";

const UserInviteFriends = () => {
  return (
    <UserAuthWrapper>
      {({ user }) => (
        <div className="min-h-screen bg-casino-darker">
          <UserNavbar userId={user.id} userEmail={user.email} />
          <main className="container mx-auto px-4 py-8">
            <InviteFriendsTab />
          </main>
        </div>
      )}
    </UserAuthWrapper>
  );
};

export default UserInviteFriends;
