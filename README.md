# Welcome to Akiba SACCO App

Akiba SACCO App is a digital solution designed to simplify and enhance the operations of savings and credit cooperative organizations (SACCOs). It empowers groups to manage their savings, loans, and memberships efficiently through an intuitive and user-friendly mobile platform. With Akiba SACCO App, you can create saving groups, track contributions, manage loan applications, and much more.

## 📝 Registration

To get started with the Akiba SACCO App, follow these steps:

1. **Create an Account**  
   Sign up for a new account by providing basic details such as your name, email address, and phone number. You’ll also set a pincode for secure access.

2. **Personal Login**  
   Log in to your account using your registered email or phone number and password to access your individual dashboard and features. Make sure you verify your contact before creating a new saving group.

3. **Group Login**  
   For group-related activities, at least **three members** of the same group must log in together. This ensures security and mutual accountability for group operations.

---

## 🏦 Creating a Saving Group Account

Once you've registered, you can proceed to create a **Saving Group Account**. Here’s the information you’ll need to provide to set up your group:

### 1. **Group Name & Location**

- **Name**: Choose a **unique name** for your saving group. This will be used to identify the group.
- **Location**: Specify where the group is based, whether it's a physical or virtual group.

### 2. **Financial Details**

- **Country**: Select the **country** where the group operates.
- **Price per Share**: Define the **cost of a single share** in the group. This is the amount a member will pay for each share in the group.
- **Minimum Share**: Set the **minimum number of shares** a member must purchase to be part of the group.
- **Maximum Share**: Set the **maximum number of shares** a member can purchase.

### 3. **Interest Calculation**

- **Interest Method**: Choose how interest will be calculated:
- **One-time**: Interest is calculated and applied once, at the end of the saving cycle.
- **Monthly Declining**: Interest is applied monthly and decreases as time goes on.
- **One-time Interest Application**: Choose whether interest will be **added** to the savings or handled differently.

### 4. **Saving Cycle & Dates**

- **Saving Cycle Method**: Decide how often the group will contribute to the savings. Options include:
- **Daily**: Members contribute daily.
- **Weekly**, **Monthly**, etc.
- **Saving Starting Day**: Choose the **day of the week** the saving cycle will begin. For example, you can start on a **Sunday**.
- **Start Date**: Set the **start date** of the saving cycle.
- **Shareout Date**: Determine when the savings will be **distributed** among the members.

---

## 🏦 Wallets and Contributions

Once the saving group account is set up, the group will have three default wallets:

1. **Saving Wallet**  
   - This wallet is where members' contributions for savings will be stored. It keeps track of all deposits made by members and the group's total balance.

2. **Social Fund**  
   - The social fund wallet is used for community-focused initiatives, charitable contributions, and special group events. It helps members contribute to non-financial goals.

3. **Loan Wallet**  
   - This wallet is dedicated to managing the loans and their repayments. It tracks all loan applications, disbursements, and repayments made by the group members.

These wallets ensure that the group’s financial activities are well-organized, with clear records of contributions, loans, and other transactions.

---

## 💼 Group Management

Once your saving group is set up, you can manage various aspects of the group. Here's a breakdown of the key features available:

### 1. **Group Wallet**  

- The **Group Wallet** holds all the funds contributed by the members. It tracks the total savings and allows for easy management of funds within the group. A member can be able to choose which wallet to deposit funds into.

### 2. **Group Members**

- As the group grows, you can manage all the **members** who have joined through adding them or inviting them or even group join request. You can view their profiles, track their contributions, and ensure they are actively participating in the saving cycle.

### 3. **Group Member Roles**  

- Every member can have a **role** within the group. Common roles include:
- **Admin**: The person who manages and oversees the group.
- **Member**: A participant in the saving group who contributes regularly.
- **Treasurer**: Responsible for managing the group wallet and financial records.
- You can assign and manage roles within the group based on members’ responsibilities.

### 4. **Meetings**  

- The group can schedule **meetings** to discuss group matters, track progress, and address any concerns. You can manage meeting dates, agendas, and attendance, ensuring members stay informed and engaged.

#### 1. **Attendance**  

- **Attendance** tracking is important for monitoring which members are present for meetings, ensuring active participation. You can mark attendance for each meeting and review the records to track member involvement per every meeting.

#### 2. **Saving Contributions**  

- Members can contribute their **savings** to the group based on group wallet so each member can choose which wallet to deposit their savings.

### 5. **Invitations**  

- To expand your group, you can **invite new members** to join. Invitations are sent via email or SMS, and potential members can accept the invitation and join the group.

### 6. **Group Join Requests**  

- When a new member wants to join the group, they must submit a **join request**. The group admin can approve or deny the request based on the group’s requirements and capacity.

---

## 🚀 Build the APK

To build the APK for the Akiba SACCO App, follow these steps:

```bash
eas build --profile preview --platform android
