export const CONTACT_EMAIL = "lhthenuwara@gmail.com";
export const CONTACT_TOPICS = ["A project", "A collaboration", "A role or opportunity", "Just saying hello"] as const;
export const CONTACT_LIMITS = { name: 100, email: 254, company: 160, message: 5000 };
export type ContactField = "name" | "email" | "company" | "topic" | "message";
export type ContactErrors = Partial<Record<ContactField, string>>;

export function validateContact(input: Record<string, unknown>) {
  const text = (key: string) => typeof input[key] === "string" ? input[key].trim() : "";
  const data = { name: text("name"), email: text("email").toLowerCase(), company: text("company"), topic: text("topic"), message: text("message") };
  const errors: ContactErrors = {};
  if (!data.name || data.name.length > CONTACT_LIMITS.name) errors.name = "Enter your name, up to 100 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > CONTACT_LIMITS.email) errors.email = "Enter an email address I can reply to.";
  if (data.company.length > CONTACT_LIMITS.company) errors.company = "Keep the company name under 160 characters.";
  if (data.topic && !(CONTACT_TOPICS as readonly string[]).includes(data.topic)) errors.topic = "Choose one of the topics listed.";
  if (data.message.length < 10 || data.message.length > CONTACT_LIMITS.message) errors.message = "Write a little more, between 10 and 5,000 characters.";
  return { data, errors, valid: Object.keys(errors).length === 0 };
}
