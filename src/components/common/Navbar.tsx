// components/Navbar.tsx
import { getProfile } from '@/server-action/auth.action';
import NavbarClient from '../NavbarClient';
import { getNotifications } from '@/server-action/post.action';

export default async function Navbar() {
  const profile = await getProfile();
    const notifResult = await getNotifications();
    const notifications = notifResult.success ? notifResult.notifications : [];

    return <NavbarClient profile={profile} notif={notifications} />;

}
