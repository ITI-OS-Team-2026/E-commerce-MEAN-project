/** Role stored on the user record. */
export type SignupRole = 'customer' | 'seller';

/**
 * JSON body for registration — matches backend `{ name, email, password, role }`.
 * The form uses `fullName`; map it to `name` when you build this object.
 */
export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: SignupRole;
}
