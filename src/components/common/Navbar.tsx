// components/Navbar.tsx
import { getProfile } from '@/server-action/auth.action';
import NavbarClient from '../NavbarClient';

export default async function Navbar() {
  const profile = await getProfile();
  return <NavbarClient profile={profile} />;
}
