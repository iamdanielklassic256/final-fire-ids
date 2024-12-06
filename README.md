# Welcome to Akiba SACCO App

Akiba SACCO App is a digital solution designed to simplify and enhance the operations of savings and credit cooperative organizations (SACCOs). It empowers groups to manage their savings, loans, and memberships efficiently through an intuitive and user-friendly mobile platform. With Akiba SACCO App, you can create saving groups, track contributions, manage loan applications, and much more.

---

## 📝 Registration

To get started with the Akiba SACCO App, follow these steps:

1. **Create an Account**  
   Sign up for a new account by providing basic details such as your name, email address, and phone number. You’ll also set a pincode for secure access.

2. **Personal Login**  
   Log in to your account using your registered email or phone number and password to access your individual dashboard and features and make sure you verfiy your contact before creating a new saving group.

3. **Group Login**  
   For group-related activities, at least **three members** of the same group must log in together. This ensures security and mutual accountability for group operations.

---

## 🏦 Creating a Saving Group Account

Once registered, you can create a saving group account. Provide the following information when setting up the account:

```json
{
  "name": "string",
  "location": "string",
  "country": "string",
  "price_per_share": "string",
  "minimum_share": 0,
  "maximum_share": 0,
  "interate_method": "one-time",
  "oneTimeInterestMethod": "added",
  "monthlyInterestMethod": "declining",
  "interestRate": "string",
  "saving_cycle_method": "daily",
  "saving_starting_day": "Sunday",
  "start_date": "string",
  "shareout_date": "string"
}
