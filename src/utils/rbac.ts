import { User } from '../types/auth';

/**
 * Mocks tenant isolation by filtering organizations based on the logged-in user.
 * - Superadmins see all organizations.
 * - Normal users see organizations whose name matches their email domain or username.
 * - As a fallback, assigns a consistent single organization based on their email.
 */
export const getVisibleOrganizations = (organizations: any[] | undefined, user: User | null) => {
  if (!organizations || organizations.length === 0) return [];
  if (!user) return [];
  
  if (user.role === 'superadmin') {
    return organizations;
  }

  // If the user explicitly selected an organization during login/signup, use it!
  if (user.assignedOrganizationId) {
    const explicitOrg = organizations.filter(org => org.id === user.assignedOrganizationId);
    if (explicitOrg.length > 0) return explicitOrg;
  }

  // Otherwise, try to match organization to user's domain or name
  const userDomain = user.email.split('@')[1]?.toLowerCase() || '';
  const userName = user.name.toLowerCase();

  const matched = organizations.filter(org => {
    const orgName = org.name.toLowerCase();
    // E.g., user@enpointe.io matches Enpointe.io
    // user@collage.com matches collage
    return orgName === userDomain || 
           orgName.includes(userName) || 
           userDomain.includes(orgName);
  });

  if (matched.length > 0) {
    return matched;
  }

  // Fallback: Deterministically assign ONE organization based on email length
  const hashIndex = user.email.length % organizations.length;
  return [organizations[hashIndex]];
};
