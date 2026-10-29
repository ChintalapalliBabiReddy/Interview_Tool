
const getAdminEmails = () => {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

const isAdmin = (email) => {
  if (typeof email !== "string") {
    return false;
  }

  return getAdminEmails().includes(email.trim().toLowerCase());
};

module.exports = isAdmin;
