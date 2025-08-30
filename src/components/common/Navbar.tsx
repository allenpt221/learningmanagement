// components/Navbar.tsx
import { getProfile } from '@/actions/auth.action';
import NavbarClient from '../NavbarClient';
import { getNotifications } from '@/actions/post.action';

async function Navbar() {
  const profile = await getProfile();
    const notifResult = await getNotifications();
    const notifications = notifResult.success ? notifResult.notifications : [];

    return <NavbarClient profile={profile} notif={notifications} />;

}

export default Navbar;
